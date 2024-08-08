<%@ page contentType="text/html; charset=UTF-8" %><%
%><%@ include file="/jcore/doInitPage.jspf" %><%
%><jsp:useBean id='formHandler' scope='page' class='com.jalios.jcmsplugin.rainbow.RainbowAsyncShortcutHandler'><%
%><jsp:setProperty name="formHandler" property="pageContext" value="<%= pageContext %>"/><%
%><jsp:setProperty name='formHandler' property='*' /><%
%></jsp:useBean><%

%><%= formHandler.getJsonResponse() %>