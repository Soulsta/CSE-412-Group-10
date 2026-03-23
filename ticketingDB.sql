--
-- PostgreSQL database dump
--

\restrict LRY5bf3pGbQ6SeGMdVyxq2Aotfe7h2p9dlL68BmSMuMGOmzKUi8ADHk7p7Mi9YD

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.0

-- Started on 2026-03-21 18:00:50 MST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 865 (class 1247 OID 32798)
-- Name: event_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.event_status AS ENUM (
    'Scheduled',
    'Completed',
    'Canceled'
);


ALTER TYPE public.event_status OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 32780)
-- Name: athleticadministrator; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.athleticadministrator (
    staffid integer NOT NULL,
    staffemail character varying(255) NOT NULL,
    staffpassword character varying(50) NOT NULL,
    staffrole character varying(50) NOT NULL
);


ALTER TABLE public.athleticadministrator OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 32791)
-- Name: category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category (
    categorytype character varying(100) NOT NULL
);


ALTER TABLE public.category OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 32805)
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    eventid integer NOT NULL,
    eventlocation character varying(255) NOT NULL,
    eventtime timestamp without time zone NOT NULL,
    releasestart timestamp without time zone NOT NULL,
    releaseend timestamp without time zone NOT NULL,
    capacity integer NOT NULL,
    maxticketsperstudent integer NOT NULL,
    status public.event_status NOT NULL,
    categorytype character varying(100) NOT NULL,
    staffid integer NOT NULL,
    CONSTRAINT events_capacity_check CHECK ((capacity > 0)),
    CONSTRAINT events_maxticketsperstudent_check CHECK ((maxticketsperstudent = 1)),
    CONSTRAINT releasetime CHECK ((releasestart < releaseend))
);


ALTER TABLE public.events OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 32769)
-- Name: student; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student (
    asurite character varying(50) NOT NULL,
    password character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    eligible boolean NOT NULL
);


ALTER TABLE public.student OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 32833)
-- Name: ticket; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ticket (
    ticketid integer NOT NULL,
    eventid integer NOT NULL,
    asurite character varying(50) NOT NULL
);


ALTER TABLE public.ticket OWNER TO postgres;

--
-- TOC entry 3696 (class 2606 OID 32788)
-- Name: athleticadministrator athleticadministrator_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.athleticadministrator
    ADD CONSTRAINT athleticadministrator_pkey PRIMARY KEY (staffid);


--
-- TOC entry 3698 (class 2606 OID 32790)
-- Name: athleticadministrator athleticadministrator_staffemail_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.athleticadministrator
    ADD CONSTRAINT athleticadministrator_staffemail_key UNIQUE (staffemail);


--
-- TOC entry 3700 (class 2606 OID 32796)
-- Name: category category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (categorytype);


--
-- TOC entry 3702 (class 2606 OID 32822)
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (eventid);


--
-- TOC entry 3692 (class 2606 OID 32779)
-- Name: student student_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_email_key UNIQUE (email);


--
-- TOC entry 3694 (class 2606 OID 32777)
-- Name: student student_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_pkey PRIMARY KEY (asurite);


--
-- TOC entry 3704 (class 2606 OID 32840)
-- Name: ticket ticket_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket
    ADD CONSTRAINT ticket_pkey PRIMARY KEY (ticketid);


--
-- TOC entry 3706 (class 2606 OID 32842)
-- Name: ticket unique_ticketid; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket
    ADD CONSTRAINT unique_ticketid UNIQUE (eventid, asurite);


--
-- TOC entry 3709 (class 2606 OID 32848)
-- Name: ticket fkey_asurite; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket
    ADD CONSTRAINT fkey_asurite FOREIGN KEY (asurite) REFERENCES public.student(asurite) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3710 (class 2606 OID 32843)
-- Name: ticket fkey_eventid; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket
    ADD CONSTRAINT fkey_eventid FOREIGN KEY (eventid) REFERENCES public.events(eventid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3707 (class 2606 OID 32823)
-- Name: events foreignkey_eventcategory; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT foreignkey_eventcategory FOREIGN KEY (categorytype) REFERENCES public.category(categorytype) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3708 (class 2606 OID 32828)
-- Name: events foreignkey_eventstaff; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT foreignkey_eventstaff FOREIGN KEY (staffid) REFERENCES public.athleticadministrator(staffid) ON UPDATE CASCADE ON DELETE RESTRICT;


-- Completed on 2026-03-21 18:00:50 MST

--
-- PostgreSQL database dump complete
--

\unrestrict LRY5bf3pGbQ6SeGMdVyxq2Aotfe7h2p9dlL68BmSMuMGOmzKUi8ADHk7p7Mi9YD

