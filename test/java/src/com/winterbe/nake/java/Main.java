package com.winterbe.nake.java;

import com.winterbe.nake.java.model.Person;
import com.winterbe.nake.java.service.Greeter;
import com.winterbe.nake.java.service.impl.GreeterImpl;

import java.util.Optional;

/**
 * @author Benjamin Winterberg
 */
public class Main {

    public static void main(String[] args) {
        Greeter greeter = new GreeterImpl();
        if (args.length == 0) {
            greeter.greet(Optional.<Person>empty());
            return;
        }

        String name = args[0];
        if (name.equals("undefined")) {
            greeter.greet(Optional.<Person>empty());
            return;
        }

        Person person = new Person();
        person.setName(name);
        greeter.greet(Optional.of(person));
    }

}
