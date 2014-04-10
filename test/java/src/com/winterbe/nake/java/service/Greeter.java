package com.winterbe.nake.java.service;

import com.winterbe.nake.java.model.Person;

import java.util.Optional;

/**
 * @author Benjamin Winterberg
 */
public interface Greeter {
    void greet(Optional<Person> optional);
}