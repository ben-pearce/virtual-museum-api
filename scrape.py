"""
This is a script used for copying data from The Science Museum's
collections online API into a local relational database such as
PostgreSQL which can then be queried by virtual-museum-api.

Example usage:
::

    python scrape.py
"""

import asyncio
import argparse
import json
import logging
import typing
from dataclasses import dataclass, field
from datetime import datetime
from urllib.parse import urlencode

import aiohttp
import asyncpg

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('collections_api')

"""
Base URL for science museum collections
API. 
"""
COLLECTIONS_API_URL = 'https://collection.sciencemuseumgroup.org.uk'

"""
Headers which are a prerequisite for access
to the API.
"""
COLLECTIONS_API_HEADERS = {
    'Accept': 'application/json'
}

"""
Format for timestamps returned by collections
API.
"""
TIME_FORMAT = '%Y-%m-%d'


def collections_primary_value_from_attribute(o, key) -> typing.Union[str, None]:
    """
    Method for selecting data from elements in the JSON
    structured response from collections API.

    **only required for some fields?**

    :param o: Object to select from.
    :param key: Key for data required from object.
    :return: A string containing the value for specified key.
    """
    if key not in o:
        return None
    data = next((d for d in o[key] if d.get('primary', False)), None)
    return None if data is None else data['value']


@dataclass
class Person:
    """
    Object for temporarily storing data about a person
    from the collections API before it is copied into
    the data store.
    """
    id: str
    name: str = None
    note: typing.Union[str, None] = None
    description: typing.Union[str, None] = None
    birth_date: typing.Union[datetime.date, None] = None
    death_date: typing.Union[datetime.date, None] = None
    gender: typing.Union[str, None] = None
    nationality: typing.Union[str, None] = None
    occupation: typing.Union[str, None] = None
    url: typing.Union[str, None] = None


@dataclass
class Place:
    """
    Object for temporarily storing data about a place
    from the collections API before it is copied into
    the data store.
    """
    id: str
    name: str


@dataclass
class Facility:
    """
    Object for temporarily storing data about a facility
    from the collections API before it is copied into the
    data store.
    """
    id: str
    name: str


@dataclass
class Object:
    """
    Object for temporarily storing data about a museum object
    from the collections API before it is copied into the
    data store.
    """
    id: str
    title: str = None
    description: str = None
    accession: str = None
    category: int = None
    url: str = None

    creation_earliest: typing.Union[int, None] = None
    creation_latest: typing.Union[int, None] = None
    on_display: typing.Union[Facility, None] = None

    creation_makers: typing.List[Person] = field(default_factory=lambda: list())
    creation_places: typing.List[Place] = field(default_factory=lambda: list())
    images: typing.List[str] = field(default_factory=lambda: list())
    people_relations: typing.List[Person] = field(default_factory=lambda: list())


async def get_person(person_id: str) -> Person:
    """
    Requests information about a specific person/organisation from
    the collections API and returns it in the form of a Person object.

    :param person_id: The ID of the person/organisation in the collections API.
    :return: A person instance.
    """
    request_uri = f'{COLLECTIONS_API_URL}/people/{person_id}'

    async with aiohttp.ClientSession(headers=COLLECTIONS_API_HEADERS) as session:
        async with session.get(request_uri) as response:
            result = await response.json()

            o = result.get('data')
            attributes = o.get('attributes')
            try:
                p = Person(o.get('id'))

                logger.info(f'processing person with id {p.id}')

                p.name = collections_primary_value_from_attribute(
                    attributes, 'name'
                )
                p.note = collections_primary_value_from_attribute(
                    attributes, 'note'
                )
                p.description = collections_primary_value_from_attribute(
                    attributes, 'description'
                )

                if 'lifecycle' in attributes:
                    lifecycle = attributes.get('lifecycle')
                    try:
                        if 'birth' in lifecycle:
                            birth = lifecycle.get('birth')[0]
                            birth_date = collections_primary_value_from_attribute(
                                birth, 'date'
                            )

                            p.birth_date = datetime.strptime(birth_date, TIME_FORMAT) \
                                if birth_date is not None else None
                        if 'death' in lifecycle:
                            death = lifecycle.get('death')[0]
                            death_date = collections_primary_value_from_attribute(
                                death, 'date'
                            )
                            p.death_date = datetime.strptime(death_date, TIME_FORMAT) \
                                if death_date is not None else None
                    except ValueError:
                        p.birth_date, p.death_date = None, None

                p.gender = attributes.get('gender', None)

                if 'nationality' in attributes:
                    p.nationality = attributes.get('nationality')[0].title()

                if 'occupation' in attributes:
                    p.occupation = attributes.get('occupation')[0].title()

                p.url = o.get('links').get('self')
            except (KeyError, IndexError) as e:
                object_dump_file_name = f'{id(o)} - {e}.txt'
                f = open(object_dump_file_name, 'w')
                json.dump(o, f, indent=4)
                logging.error(f'error processing person object dumped to {object_dump_file_name}')
    return p


async def get_objects(params: str) \
        -> typing.Dict[str, Object]:
    """
    Gets a collection of objects from the collections API based
    on parameters passed in.

    More info about the parameters which are available here:
    https://github.com/TheScienceMuseum/collectionsonline/wiki

    :param params: URL encoded parameters for collections API.
    :return: Dictionary of Object instances indexed by the object
    ID.
    """
    object_records = {}

    request_uri = f'{COLLECTIONS_API_URL}/search/objects?{params}'
    async with aiohttp.ClientSession(headers=COLLECTIONS_API_HEADERS) as session:
        async with session.get(request_uri) as response:
            result = await response.json()

            objects = result.get('data')
            logger.info(f'found {len(objects)} objects')

            for o in objects:
                try:
                    attributes = o.get('attributes')
                    e = Object(o.get('id'))

                    logger.info(f'processing object with id {e.id}')

                    e.description = collections_primary_value_from_attribute(
                        attributes, 'description'
                    )
                    e.accession = collections_primary_value_from_attribute(
                        attributes, 'identifier'
                    )

                    title_key = 'title' if 'title' in attributes else 'name'
                    e.title = collections_primary_value_from_attribute(
                        attributes, title_key
                    )

                    if 'lifecycle' in attributes and 'creation' in attributes.get('lifecycle'):
                        lifecycle = attributes.get('lifecycle')
                        creation = lifecycle.get('creation')[0]

                        if 'date' in creation:
                            dates = creation.get('date')[0]
                            if 'earliest' in dates:
                                e.creation_earliest = dates.get('earliest')
                            if 'latest' in dates:
                                e.creation_latest = dates.get('latest')

                        if 'maker' in creation:
                            makers = [get_person(m['admin']['uid'])
                                      for m in creation['maker'] if 'admin' in m]
                            e.creation_makers = await asyncio.gather(*makers)

                        if 'places' in creation:
                            e.creation_places = [Place(m['admin']['uid'],
                                                       m['summary_title'])
                                                 for m in creation['places'] if 'admin' in m]

                    if 'multimedia' in attributes:
                        for i, img in enumerate(attributes.get('multimedia')):
                            if i == 0:
                                img_data = img.get('processed').get('medium_thumbnail')
                                img_path = '/'.join(img_data.get('location').split('/')[-3:])
                                e.images.append(img_path)

                            img_data = img.get('processed').get('large')
                            img_path = '/'.join(img_data.get('location').split('/')[-3:])
                            e.images.append(img_path)

                    if 'locations' in attributes:
                        for l in attributes.get('locations'):
                            if 'purpose' in l and l.get('purpose') == 'on display':
                                location = l.get('facilities')[0]
                                e.on_display = Facility(location.get('admin').get('uid'),
                                                        location.get('summary_title'))

                    if 'people' in o.get('relationships'):
                        people = [get_person(r.get('id'))
                                  for r in o['relationships']['people']['data']]
                        e.people_relations = await asyncio.gather(*people)

                    e.url = o.get('links').get('self')

                    object_records[e.id] = e
                except (KeyError, IndexError) as e:
                    object_dump_file_name = f'{id(o)} - {e}.txt'
                    f = open(object_dump_file_name, 'w')
                    json.dump(o, f, indent=4)
                    logging.error(f'error processing object dumped to {object_dump_file_name}')

    return object_records


async def create_person(conn, p: Person):
    """
    Inserts a person instance into the datastore.

    :param conn: Connection to postgresql database.
    :param p: Person instance.
    :return: None
    """
    create_person_query = '''
    INSERT INTO collections_person
            (id, birth_date, death_date, occupation, name, note, 
            description, nationality, collections_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT DO NOTHING;
    '''

    await conn.execute(create_person_query,
                       p.id,
                       p.birth_date,
                       p.death_date,
                       p.occupation,
                       p.name,
                       p.note,
                       p.description,
                       p.nationality,
                       p.url
                       )


async def create_object(conn, o: Object):
    """
    Inserts a object instance into the datastore.

    :param conn: Connection to the postgresql database.
    :param o: Object instance.
    :return: None
    """
    create_facility_query = '''
    INSERT INTO collections_facility (id, name) 
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
    '''

    create_object_query = '''
    INSERT INTO collections_object 
            (id, name, description, accession, category_id, 
            creation_earliest, creation_latest, on_display_at, 
            collections_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT DO NOTHING;
    '''

    create_image_query = '''
    INSERT INTO collections_object_image
            (object_id, image_public_path, is_thumb)
        VALUES ($1, $2, $3)
        ON CONFLICT DO NOTHING;
    '''

    create_place_query = '''
    INSERT INTO collections_place
        (id, name) VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
    '''

    create_object_place_relationship_query = '''
    INSERT INTO collections_object_place
        (object_id, place_id) VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
    '''

    create_object_maker_query = '''
    INSERT INTO collections_object_maker
        (object_id, person_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
    '''

    create_object_person_relationship_query = '''
    INSERT INTO collections_object_person
            (object_id, person_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
    '''

    if o.on_display is not None:
        await conn.execute(create_facility_query, o.on_display.id, o.on_display.name)

        logger.info(f'created facility {o.on_display.id}:{o.on_display.name}')

    await conn.execute(create_object_query,
                       o.id,
                       o.title,
                       o.description or '',
                       o.accession,
                       o.category,
                       o.creation_earliest,
                       o.creation_latest,
                       o.on_display.id if o.on_display is not None else None,
                       o.url
                       )

    logger.info(f'created object {o.id}:{o.title}')

    logger.info(f'assigning {len(o.images)} images to object {o.id}...')
    for i, img in enumerate(o.images):
        await conn.execute(create_image_query, o.id, img, i == 0)

    logger.info(f'creating {len(o.creation_places)} places...')

    for place in o.creation_places:
        await conn.execute(create_place_query, place.id, place.name)
        await conn.execute(create_object_place_relationship_query, o.id, place.id)

    logger.info(f'creating {len(o.creation_makers) + len(o.people_relations)} people...')
    for person in o.creation_makers + o.people_relations:
        await create_person(conn, person)

    logger.info(f'assigning {len(o.creation_makers)} makers to object {o.id}')
    for person in o.creation_makers:
        await conn.execute(create_object_maker_query, o.id, person.id)

    logger.info(f'assigning {len(o.people_relations)} people to object {o.id}')
    for person in o.people_relations:
        await conn.execute(create_object_person_relationship_query, o.id, person.id)


async def main():
    """
    Establishes a connection with the postgresql datastore
    and initiates copying of objects into the schema.

    :return: None
    """

    parser = argparse.ArgumentParser(
        description='Copy data into datastore from science museum collections API.')
    database = parser.add_argument_group('database')
    database.add_argument('--postgres-user', '-u', type=str, default='postgres',
                          help='Postgres username')
    database.add_argument('--postgres-password', '-p', type=str, default='password',
                          help='Postgres password')
    database.add_argument('--postgres-database', '-d', type=str, default='postgres',
                          help='Postgress database name')
    database.add_argument('--postgres-host', '-H', type=str, default='127.0.0.1',
                          help='Postgres host')
    api = parser.add_argument_group('api')
    api.add_argument('--categories', nargs='*', type=str, default=[
        'Computing & Data Processing',
        'Photographs',
        'Surgery',
        'Photographic Technology',
        'Art',
        'Therapeutics'
    ], help='''
        Categories to collect objects for from the collections online API
    ''')
    api.add_argument('--count', '-c', type=int, default=6000, help='Number of objects to collect')

    args = parser.parse_args()

    conn = await asyncpg.connect(
        user=args.postgres_user,
        password=args.postgres_password,
        database=args.postgres_database,
        host=args.postgres_host
    )

    logger.info('successfully connected to postgres db')

    create_category_query = '''
    INSERT INTO collections_object_category
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
    '''

    total = 0
    objects_per_category = args.count // len(args.categories)
    for category_id, category in enumerate(args.categories):
        await conn.execute(create_category_query, category_id, category)

        logger.info(f'inserted category {category_id}:{category}')

        for page in range(objects_per_category // 100):
            params = urlencode({
                'page[number]': page,
                'page[size]': 100,
                'filter[categories]': category
            })
            object_records = await get_objects(params)

            total += len(object_records)

            for o in object_records.values():
                o.category = category_id
                await create_object(conn, o)

    logger.info(f'total objects: {total}')


loop = asyncio.get_event_loop()
loop.run_until_complete(main())
