<%@ include file='/jcore/doInitPage.jspf' %>
<%@ include file="/front/app/doAppCommon.jspf" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.jalios.jcmsplugin.rainbow.RainbowAuthenticator" %>
<%@ page import="javax.servlet.http.HttpServletRequest" %>
<%@ page import="javax.servlet.http.HttpServletResponse" %>
<%@ page import="com.jalios.jcms.context.JcmsContext" %>
<%@ page import="com.jalios.jcms.Channel" %>
<%@ page import="com.jalios.jcms.Member" %>
<script src="//cdnjs.cloudflare.com/ajax/libs/es5-shim/4.5.9/es5-shim.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/es6-promise/4.0.5/es6-promise.min.js"></script>
<script src="//code.jquery.com/jquery-2.1.3.min.js"></script>
<script src="https://code.jquery.com/jquery-2.1.3.min.js"></script>
<script src="//cdn.jsdelivr.net/momentjs/2.15.1/moment-with-locales.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/angular.js/1.7.5/angular.min.js"></script>
<script src="plugins/newRainbowPlugin/js/vendors-sdk.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/es5-shim/4.5.9/es5-shim.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/es6-promise/4.0.5/es6-promise.min.js"></script>
<script src="//code.jquery.com/jquery-2.1.3.min.js"></script>
<script src="https://code.jquery.com/jquery-2.1.3.min.js"></script>
<%
    // Extract access token from request parameter
    String accessToken = request.getParameter("accessToken");

if (accessToken != null && !accessToken.isEmpty()) {
    RainbowAuthenticator.setTokenRainbow(loggedMember, accessToken);
}
%>
