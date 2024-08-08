<%@ page import="java.io.IOException" %>
<%@ page import="javax.servlet.ServletException" %>
<%@ page import="javax.servlet.http.HttpServlet" %>
<%@ page import="javax.servlet.http.HttpServletRequest" %>
<%@ page import="javax.servlet.http.HttpServletResponse" %>
<%@ page import="com.jalios.jcmsplugin.rainbow.RainbowAuthenticator" %>
<%@ page import="com.jalios.jcmsplugin.rainbow.NotificationService" %>
<%@ page import="javax.servlet.http.HttpServletRequest" %>
<%@ page import="javax.servlet.http.HttpServletResponse" %>
<%@ page import="com.jalios.jcms.context.JcmsContext" %>
<%@ page import="com.jalios.jcms.Channel" %>
<%@ page import="com.jalios.jcms.Member" %>

<%
JcmsContext ctx = (JcmsContext) request.getAttribute("jcmsContext");
Member member = ctx.getLoggedMember();
    request.setAttribute("loggedMember", RainbowAuthenticator.getCurrentLoggedInMember(request));
    Member loggedMember = (Member) request.getAttribute("loggedMember");
    System.out.println(RainbowAuthenticator.getCurrentLoggedInMember(request));
	String notificationMessage = request.getParameter("notificationMessage");
   

    NotificationService notificationService = new NotificationService();
    notificationService.sendNotification("myDomain", "myAlert", notificationMessage, loggedMember);

    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");
    response.getWriter().write("{\"status\":\"success\",\"message\":\"Notification sent successfully\"}");
%>
