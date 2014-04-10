package com.winterbe.nake.java.service.impl;

import com.winterbe.nake.java.model.Person;
import com.winterbe.nake.java.service.Greeter;

import java.util.Optional;

/**
 * @author Benjamin Winterberg
 */
public class GreeterImpl implements Greeter {
    @Override
    public void greet(Optional<Person> optional) {
        if (optional.isPresent()) {
            System.out.format("Hello, %s!", optional.get().getName());
        }
        else {
            System.out.println("Hello, stranger!");
        }
    }
}