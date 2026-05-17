package com.goalsphere.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ForwardingController {

    // Forward any request that doesn't contain a dot (e.g. .js, .css, .ico)
    // and isn't an API request to the React index.html.
    @RequestMapping(value = {
        "/{path:[^\\.]*}", 
        "/**/{path:[^\\.]*}"
    })
    public String redirect() {
        return "forward:/index.html";
    }
}
