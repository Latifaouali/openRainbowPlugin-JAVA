<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="javax.servlet.*,javax.servlet.http.*,javax.servlet.jsp.*" %>
<%
    // Get the missedCounter parameter from the request
    String missedCounterStr = request.getParameter("missedCounter");
    if (missedCounterStr != null) {
        try {
            int missedCounter = Integer.parseInt(missedCounterStr);
            // Store the missedCounter value in the application context
            getServletContext().setAttribute("missedCounter", missedCounter);
            // Respond with success
            response.setStatus(HttpServletResponse.SC_OK);
            out.print("Missed counter updated successfully");
        } catch (NumberFormatException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("Invalid missed counter value");
        }
    } else {
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        out.print("Missed counter parameter is missing");
    }
%>