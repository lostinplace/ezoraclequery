NAME
====

ezoraclequery - executes query against oracle and returns results as a stream

SYNOPSIS
========

**ezoraclequery** \[*query*\]

DESCRIPTION
===========

Ezoraclequery is a program that allows you to easily grab the results of a query against an oracle datasource as a stream

OPTIONS
=======

*query*  
        query to execute. if parameter is a valid filename

*.dbconfig*  
        this program relies on a json .dbconfig file.
        it must be either in a parent folder of the one you're executing the query in, or in your home folder.
        it must contain the following 3 fields:

        "user" : the database username

        "password" : the database password

        "connectString" : the database TNS name
