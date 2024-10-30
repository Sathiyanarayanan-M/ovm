--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: player; Type: TABLE; Schema: public; Owner: postgres
--

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


ALTER TABLE public.player OWNER TO postgres;

--
-- Name: player_sno_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.player_sno_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.player_sno_seq OWNER TO postgres;

--
-- Name: player_sno_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.player_sno_seq OWNED BY public.player.sno;


--
-- Name: room; Type: TABLE; Schema: public; Owner: postgres
--

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


ALTER TABLE public.room OWNER TO postgres;

--
-- Name: room_sno_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.room_sno_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.room_sno_seq OWNER TO postgres;

--
-- Name: room_sno_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.room_sno_seq OWNED BY public.room.sno;


--
-- Name: words; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.words (
    name character varying(30) NOT NULL,
    count integer NOT NULL,
    id bigint NOT NULL
);


ALTER TABLE public.words OWNER TO postgres;

--
-- Name: words_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.words_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.words_id_seq OWNER TO postgres;

--
-- Name: words_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.words_id_seq OWNED BY public.words.id;


--
-- Name: player sno; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player ALTER COLUMN sno SET DEFAULT nextval('public.player_sno_seq'::regclass);


--
-- Name: room sno; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room ALTER COLUMN sno SET DEFAULT nextval('public.room_sno_seq'::regclass);


--
-- Name: words id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.words ALTER COLUMN id SET DEFAULT nextval('public.words_id_seq'::regclass);


--
-- Data for Name: player; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.player (name, avatar, room_id, status, id, points, is_played, guessed, sno) FROM stdin;
\.


--
-- Data for Name: room; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.room (language, duration, rounds, admin, status, is_active, id, end_time, start_time, round_no, artist, chosen_word, sno) FROM stdin;
\.


--
-- Data for Name: words; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.words (name, count, id) FROM stdin;
\.


--
-- Name: player_sno_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.player_sno_seq', 34, true);


--
-- Name: room_sno_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.room_sno_seq', 18, true);


--
-- Name: words_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.words_id_seq', 5132, true);


--
-- Name: player player_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_pkey PRIMARY KEY (id);


--
-- Name: room room_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room
    ADD CONSTRAINT room_pkey PRIMARY KEY (id);


--
-- Name: words uk_name; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.words
    ADD CONSTRAINT uk_name UNIQUE (name);


--
-- Name: words words_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.words
    ADD CONSTRAINT words_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

