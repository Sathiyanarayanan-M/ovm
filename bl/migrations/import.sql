CREATE TABLE public.player (
    name character varying(50),
    avatar character varying(50),
    room_id character varying(10),
    status character varying(13) DEFAULT 'LOBBY_WAITING'::character varying,
    id character varying(30) NOT NULL,
    points integer DEFAULT 0,
    is_played boolean DEFAULT false,
    guessed boolean DEFAULT false,
    sno bigint NOT NULL
);
CREATE SEQUENCE public.player_sno_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.player_sno_seq OWNED BY public.player.sno;
CREATE TABLE public.room (
    language character varying(50) DEFAULT 'en'::character varying,
    duration integer DEFAULT 80,
    rounds integer DEFAULT 3,
    admin character varying(30),
    status character varying(13) DEFAULT 'LOBBY_WAITING'::character varying,
    is_active boolean DEFAULT true,
    id character varying(10) NOT NULL,
    end_time timestamp with time zone,
    start_time timestamp with time zone,
    round_no integer DEFAULT 1,
    artist character varying(50),
    chosen_word character varying(50),
    sno bigint NOT NULL
);
CREATE SEQUENCE public.room_sno_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.room_sno_seq OWNED BY public.room.sno;
CREATE TABLE public.words (
    name character varying(30) NOT NULL,
    count integer NOT NULL,
    id bigint NOT NULL
);
CREATE SEQUENCE public.words_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.words_id_seq OWNED BY public.words.id;
ALTER TABLE ONLY public.player ALTER COLUMN sno SET DEFAULT nextval('public.player_sno_seq'::regclass);
ALTER TABLE ONLY public.room ALTER COLUMN sno SET DEFAULT nextval('public.room_sno_seq'::regclass);
ALTER TABLE ONLY public.words ALTER COLUMN id SET DEFAULT nextval('public.words_id_seq'::regclass);
ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.room
    ADD CONSTRAINT room_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.words
    ADD CONSTRAINT uk_name UNIQUE (name);
ALTER TABLE ONLY public.words
    ADD CONSTRAINT words_pkey PRIMARY KEY (id);