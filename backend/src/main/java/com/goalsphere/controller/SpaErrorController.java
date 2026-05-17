package com.goalsphere.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaErrorController implements ErrorController {

    @RequestMapping("/error")
    public String handleError() {
        // Forward all unhandled errors (like 404s for React routes) to the React index.html
        return "forward:/index.html";
    }
}
