PGDMP                      |            Mentalhealth    16.6    16.6     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16561    Mentalhealth    DATABASE     �   CREATE DATABASE "Mentalhealth" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_India.1252';
    DROP DATABASE "Mentalhealth";
                postgres    false                        2615    17007    public    SCHEMA     2   -- *not* creating schema, since initdb creates it
 2   -- *not* dropping schema, since initdb creates it
                postgres    false            �           0    0    SCHEMA public    COMMENT         COMMENT ON SCHEMA public IS '';
                   postgres    false    6            �           0    0    SCHEMA public    ACL     +   REVOKE USAGE ON SCHEMA public FROM PUBLIC;
                   postgres    false    6                        3079    32874 	   uuid-ossp 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
    DROP EXTENSION "uuid-ossp";
                   false    6            �           0    0    EXTENSION "uuid-ossp"    COMMENT     W   COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
                        false    2            �            1259    17008    _prisma_migrations    TABLE     �  CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);
 &   DROP TABLE public._prisma_migrations;
       public         heap    postgres    false    6            �            1259    17027    formdatamaster    TABLE     �  CREATE TABLE public.formdatamaster (
    id integer NOT NULL,
    user_id integer,
    feelings character varying(255) NOT NULL,
    current_mood character varying NOT NULL,
    current_stress_level integer NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    health_status integer
);
 "   DROP TABLE public.formdatamaster;
       public         heap    postgres    false    6            �            1259    17026    formdatamaster_id_seq    SEQUENCE     �   CREATE SEQUENCE public.formdatamaster_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.formdatamaster_id_seq;
       public          postgres    false    220    6            �           0    0    formdatamaster_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.formdatamaster_id_seq OWNED BY public.formdatamaster.id;
          public          postgres    false    219            �            1259    32865 
   rolemaster    TABLE       CREATE TABLE public.rolemaster (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
    DROP TABLE public.rolemaster;
       public         heap    postgres    false    2    6    6            �            1259    17018 
   usermaster    TABLE     ]  CREATE TABLE public.usermaster (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
    role_id uuid
);
    DROP TABLE public.usermaster;
       public         heap    postgres    false    6            �            1259    17017    usermaster_id_seq    SEQUENCE     �   CREATE SEQUENCE public.usermaster_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.usermaster_id_seq;
       public          postgres    false    218    6            �           0    0    usermaster_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.usermaster_id_seq OWNED BY public.usermaster.id;
          public          postgres    false    217            7           2604    17030    formdatamaster id    DEFAULT     v   ALTER TABLE ONLY public.formdatamaster ALTER COLUMN id SET DEFAULT nextval('public.formdatamaster_id_seq'::regclass);
 @   ALTER TABLE public.formdatamaster ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    220    219    220            4           2604    17021    usermaster id    DEFAULT     n   ALTER TABLE ONLY public.usermaster ALTER COLUMN id SET DEFAULT nextval('public.usermaster_id_seq'::regclass);
 <   ALTER TABLE public.usermaster ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    217    218    218            �          0    17008    _prisma_migrations 
   TABLE DATA           �   COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
    public          postgres    false    216   %       �          0    17027    formdatamaster 
   TABLE DATA           �   COPY public.formdatamaster (id, user_id, feelings, current_mood, current_stress_level, created_at, updated_at, health_status) FROM stdin;
    public          postgres    false    220   �&       �          0    32865 
   rolemaster 
   TABLE DATA           F   COPY public.rolemaster (id, name, created_at, updated_at) FROM stdin;
    public          postgres    false    221   �'       �          0    17018 
   usermaster 
   TABLE DATA           `   COPY public.usermaster (id, email, password, name, created_at, updated_at, role_id) FROM stdin;
    public          postgres    false    218   A(       �           0    0    formdatamaster_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.formdatamaster_id_seq', 10, true);
          public          postgres    false    219            �           0    0    usermaster_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.usermaster_id_seq', 5, true);
          public          postgres    false    217            >           2606    17016 *   _prisma_migrations _prisma_migrations_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public._prisma_migrations DROP CONSTRAINT _prisma_migrations_pkey;
       public            postgres    false    216            B           2606    17034 "   formdatamaster formdatamaster_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.formdatamaster
    ADD CONSTRAINT formdatamaster_pkey PRIMARY KEY (id);
 L   ALTER TABLE ONLY public.formdatamaster DROP CONSTRAINT formdatamaster_pkey;
       public            postgres    false    220            D           2606    32873    rolemaster rolemaster_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.rolemaster
    ADD CONSTRAINT rolemaster_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.rolemaster DROP CONSTRAINT rolemaster_pkey;
       public            postgres    false    221            @           2606    17025    usermaster usermaster_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.usermaster
    ADD CONSTRAINT usermaster_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.usermaster DROP CONSTRAINT usermaster_pkey;
       public            postgres    false    218            F           2606    32896 *   formdatamaster formdatamaster_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.formdatamaster
    ADD CONSTRAINT formdatamaster_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.usermaster(id) ON UPDATE SET NULL ON DELETE SET NULL NOT VALID;
 T   ALTER TABLE ONLY public.formdatamaster DROP CONSTRAINT formdatamaster_user_id_fkey;
       public          postgres    false    218    4672    220            E           2606    32891 "   usermaster usermaster_role_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.usermaster
    ADD CONSTRAINT usermaster_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.rolemaster(id) ON UPDATE SET NULL ON DELETE SET NULL NOT VALID;
 L   ALTER TABLE ONLY public.usermaster DROP CONSTRAINT usermaster_role_id_fkey;
       public          postgres    false    221    218    4676            �   �  x�}�Kj0D��Sd4��3��	���l����l���vR5��Js�)X�	�7Y���$u���˚�3sH�Q؁�a��n\ɚ�Da�����
b-̬ƅ��!6�o�7������;���"�2��_���<�x9����L��R|�=H�{30o�8�$���49�2.c��
2�1z�]C�@;I�2PUQ�UPZ�˙A�|M��,b����k�W� �7��
��v�-p�u�$�$��2�y�Ϟ�9;AE�@#�NS�k�	Rѣ�*�;?0BWG�B_3�3���*�V��	��rU��S,�x��$�@�%�O��u�f͓d�p$��|�J��M��}v6yS���}`@DP>��ʃz��i��|���j�h*�5lź�'��9wW��48aZJ$X�	1#r��4�F�����Q��g!��HO+��]
����|}zz�*/�K      �   �   x����
�0F��)��CQr��u���%��1"��+]Ji�����N)Ot�Ύ=8�Ch��GSk"��y�$'��K�y"p�E�3�晐J�Y�%��nT����w��v�!B��E���؍Y��i��@�_��m��nZ����%VZ�Tɯ���h�RJ�]�E      �      x��ͱ
B1@ѹ�
wII�$�t�#�\^�t���q?�;�b�Pq���}��݄0���zO�,@��&[C)Q[ſ Gt���l��À�tĉ}���3�)�E�����K�9� �0^      �   }  x���Ms�0������#EZ}Y>Q')�@iw�Ȓ$MlS��	dʔz���ξ��.}�\��(�j�7���>A1�d��K6YOڄ�7Iͪ����w��:s��[<��r.�O��ͮ0s�|�� G�"�^�(�� �K"bF���}\:���q)Kd�J%/q�p��"hL_W��'����������C&bJ���9�,�����|�{���f-v��}�S���˭}7�Vg9�l���}�^&_����f�����)��i���<���`	�s�iP��i���Yn����0;v��D1]����v��[�h��+�rPWw�q�����<����(�~��j��y�5�Z�����.})�䔄q�� ��,     