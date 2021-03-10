

--
-- Database schema for virtual-museum-api
--

CREATE TABLE public.collections_facility (
    id character varying(20) NOT NULL,
    name character varying(255),
    PRIMARY KEY (id)
);

COMMENT ON TABLE public.collections_facility IS 'Museum facilities objects can be found at';
COMMENT ON COLUMN public.collections_facility.id IS 'Facility unique ID';
COMMENT ON COLUMN public.collections_facility.name IS 'Facility name';

CREATE TABLE public.collections_object_category (
    id smallint NOT NULL,
    name character varying(255),
    PRIMARY KEY (id)
);

COMMENT ON TABLE public.collections_object_category IS 'Object categories';
COMMENT ON COLUMN public.collections_object_category.id IS 'Unique category ID';
COMMENT ON COLUMN public.collections_object_category.name IS 'Category name';

CREATE SEQUENCE public.collections_object_category_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.collections_object_category_id_seq OWNED BY public.collections_object_category.id;

CREATE TABLE public.collections_object (
    id character varying(20) NOT NULL,
    name character varying(255) NOT NULL,
    description text NOT NULL,
    category_id smallint NOT NULL,
    creation_earliest int,
    creation_latest int,
    on_display_at character varying(20),
    collections_url text,
    accession character varying(255),
    PRIMARY KEY (id),
    CONSTRAINT collections_object_collections_object_category_id_fk 
        FOREIGN KEY (category_id) REFERENCES public.collections_object_category(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT collections_object_collections_facility_id_fk
        FOREIGN KEY (on_display_at) REFERENCES public.collections_facility(id) ON UPDATE CASCADE ON DELETE CASCADE
);

COMMENT ON COLUMN public.collections_object.id IS 'Unique museum identifier';
COMMENT ON COLUMN public.collections_object.name IS 'Museum object title';
COMMENT ON COLUMN public.collections_object.description IS 'Museum object description';
COMMENT ON COLUMN public.collections_object.category_id IS 'Type of object';
COMMENT ON COLUMN public.collections_object.creation_earliest IS 'Earliest creation date';
COMMENT ON COLUMN public.collections_object.creation_latest IS 'Latest creation date';
COMMENT ON COLUMN public.collections_object.on_display_at IS 'Location of display unit';
COMMENT ON COLUMN public.collections_object.accession IS 'Museum accession no.';

CREATE UNIQUE INDEX collections_objects_id_uindex ON public.collections_object USING btree (id);

CREATE UNIQUE INDEX collections_object_accession_uindex ON public.collections_object USING btree (accession);

CREATE TABLE public.collections_object_image (
    object_id character varying(20) NOT NULL,
    image_public_path character varying(255) NOT NULL,
    is_thumb boolean DEFAULT false NOT NULL,
    PRIMARY KEY (image_public_path, object_id),
    CONSTRAINT collections_object_image_collections_object_id_fk 
        FOREIGN KEY (object_id) REFERENCES public.collections_object(id) ON UPDATE CASCADE ON DELETE CASCADE
);

COMMENT ON COLUMN public.collections_object_image.object_id IS 'Related object ID';
COMMENT ON COLUMN public.collections_object_image.image_public_path IS 'Path to public image';
COMMENT ON COLUMN public.collections_object_image.is_thumb IS 'Is image a thumbnail?';

CREATE TABLE public.collections_person (
    id character varying(20) NOT NULL,
    birth_date date,
    death_date date,
    occupation character varying(255),
    name character varying(255),
    note text,
    description text,
    nationality character varying(255),
    collections_url text,
    PRIMARY KEY (id)
);

COMMENT ON TABLE public.collections_person IS 'Collections person/organisation';
COMMENT ON COLUMN public.collections_person.id IS 'Museum unique identifier';
COMMENT ON COLUMN public.collections_person.birth_date IS 'Person date of birth';
COMMENT ON COLUMN public.collections_person.death_date IS 'Person date of death';
COMMENT ON COLUMN public.collections_person.occupation IS 'Person occupation';
COMMENT ON COLUMN public.collections_person.name IS 'Name of person';
COMMENT ON COLUMN public.collections_person.note IS 'Person note';
COMMENT ON COLUMN public.collections_person.description IS 'Person description';
COMMENT ON COLUMN public.collections_person.nationality IS 'Nationality of person';
COMMENT ON COLUMN public.collections_person.collections_url IS 'Original collections URL';

CREATE UNIQUE INDEX collections_people_id_uindex ON public.collections_person USING btree (id);


CREATE TABLE public.collections_object_maker (
    object_id character varying(20) NOT NULL,
    person_id character varying(20) NOT NULL,
    PRIMARY KEY (object_id, person_id),
    CONSTRAINT collections_object_makers_collections_object_id_fk 
        FOREIGN KEY (object_id) REFERENCES public.collections_object(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT collections_object_makers_collections_person_id_fk
        FOREIGN KEY (person_id) REFERENCES public.collections_person(id) ON UPDATE CASCADE ON DELETE CASCADE
);

COMMENT ON TABLE public.collections_object_maker IS 'Collection object creator relations';
COMMENT ON COLUMN public.collections_object_maker.object_id IS 'Object ID of relationship';
COMMENT ON COLUMN public.collections_object_maker.person_id IS 'Person ID of relationship';

CREATE TABLE public.collections_place (
    id character varying(20) NOT NULL,
    name character varying(255) NOT NULL,
    PRIMARY KEY (id)
);


COMMENT ON TABLE public.collections_place IS 'Collections geographical places';
COMMENT ON COLUMN public.collections_place.id IS 'Unique place ID';
COMMENT ON COLUMN public.collections_place.name IS 'Name of place';

CREATE TABLE public.collections_object_person (
    object_id character varying(20) NOT NULL,
    person_id character varying(20) NOT NULL,
    PRIMARY KEY (object_id, person_id),
    CONSTRAINT collections_object_person_collections_object_id_fk 
        FOREIGN KEY (object_id) REFERENCES public.collections_object(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT collections_object_person_collections_person_id_fk 
        FOREIGN KEY (person_id) REFERENCES public.collections_person(id) ON UPDATE CASCADE ON DELETE CASCADE
);


COMMENT ON TABLE public.collections_object_person IS 'Object person relationships';
COMMENT ON COLUMN public.collections_object_person.object_id IS 'Unique object ID';
COMMENT ON COLUMN public.collections_object_person.person_id IS 'Unique person ID ';

CREATE TABLE public.collections_object_place (
    place_id character varying(20) NOT NULL,
    object_id character varying(20) NOT NULL,
    PRIMARY KEY (place_id, object_id),
    CONSTRAINT collections_object_place_collections_place_id_fk 
        FOREIGN KEY (place_id) REFERENCES public.collections_place(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT collections_object_place_collections_object_id_fk 
        FOREIGN KEY (object_id) REFERENCES public.collections_object(id) ON UPDATE CASCADE ON DELETE CASCADE
);

COMMENT ON TABLE public.collections_object_place IS 'Object place relationships';
COMMENT ON COLUMN public.collections_object_place.place_id IS 'Unique place ID';
COMMENT ON COLUMN public.collections_object_place.object_id IS 'Unique object ID';

CREATE TABLE public."user" (
    id integer NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    password bytea,
    administrator boolean DEFAULT false NOT NULL,
    PRIMARY KEY (id)
);

COMMENT ON TABLE public."user" IS 'Museum users';
COMMENT ON COLUMN public."user".id IS 'User unique ID';
COMMENT ON COLUMN public."user".first_name IS 'User first name';
COMMENT ON COLUMN public."user".last_name IS 'User last name';
COMMENT ON COLUMN public."user".email IS 'User email address';
COMMENT ON COLUMN public."user".password IS 'User password hash';
COMMENT ON COLUMN public."user".administrator IS 'Is user administrator?';

CREATE UNIQUE INDEX user_email_uindex ON public."user" USING btree (email);

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;
ALTER TABLE ONLY public.collections_object_category ALTER COLUMN id SET DEFAULT nextval('public.collections_object_category_id_seq'::regclass);
ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);

CREATE TABLE public.user_collections_object_favourite (
    user_id integer NOT NULL,
    object_id character varying(20) NOT NULL,
    PRIMARY KEY (user_id, object_id),
    CONSTRAINT user_collections_object_favourite_user_id_fk 
        FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT user_collections_object_favourite_collections_object_id_fk
        FOREIGN KEY (object_id) REFERENCES public.collections_object(id) ON UPDATE CASCADE ON DELETE CASCADE
);

COMMENT ON TABLE public.user_collections_object_favourite IS 'User favourited museum objects';
COMMENT ON COLUMN public.user_collections_object_favourite.user_id IS 'Liker user ID';
COMMENT ON COLUMN public.user_collections_object_favourite.object_id IS 'Liked object ID';

CREATE TABLE public.user_collections_person_favourite (
    user_id integer NOT NULL,
    person_id character varying(20) NOT NULL,
    PRIMARY KEY (user_id, person_id),
    CONSTRAINT user_collections_person_favourite_user_id_fk 
        FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT user_collections_person_favourite_collections_person_id_fk
        FOREIGN KEY (person_id) REFERENCES public.collections_person(id) ON UPDATE CASCADE ON DELETE CASCADE
);

COMMENT ON TABLE public.user_collections_person_favourite IS 'User favourited museum people';
COMMENT ON COLUMN public.user_collections_person_favourite.user_id IS 'Liker user ID';
COMMENT ON COLUMN public.user_collections_person_favourite.person_id IS 'Liked person ID';


SELECT pg_catalog.setval('public.collections_object_category_id_seq', 1, false);
SELECT pg_catalog.setval('public.user_id_seq', 1, false);
