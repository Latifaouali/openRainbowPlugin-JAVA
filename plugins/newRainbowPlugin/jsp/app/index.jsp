<%@ include file='/jcore/doInitPage.jspf' %>
<%@ include file="/front/app/doAppCommon.jspf" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.jalios.jcmsplugin.rainbow.RainbowAuthenticator" %>
<%@ page import="javax.servlet.http.HttpServletRequest" %>
<%@ page import="javax.servlet.http.HttpServletResponse" %>
<%@ page import="com.jalios.jcms.context.JcmsContext" %>
<%@ page import="com.jalios.jcms.Channel" %>
<%@ page import="com.jalios.jcms.Member" %>
<%@ page import="org.json.JSONObject" %>

<!-- Include necessary external libraries -->
<script src="//cdnjs.cloudflare.com/ajax/libs/es5-shim/4.5.9/es5-shim.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/es6-promise/4.0.5/es6-promise.min.js"></script>
<script src="//cdn.jsdelivr.net/momentjs/2.15.1/moment-with-locales.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/angular.js/1.7.5/angular.min.js"></script>
<script src="plugins/newRainbowPlugin/js/vendors-sdk.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jwt-decode/3.1.2/index.min.js"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/remixicon@3.2.0/fonts/remixicon.css" rel="stylesheet">


<%     
    request.setAttribute("loggedMember", RainbowAuthenticator.getCurrentLoggedInMember(request));
    String token = RainbowAuthenticator.getTokenRainbow(loggedMember);
    String applicationID = RainbowAuthenticator.getApplicationID();
    %>
<script>
    var applicationID = '<%= applicationID %>';
    var secretKey = '<%= RainbowAuthenticator.getSecretKey() %>';
    var token = '<%= token %>';
    var outgoingcall= '<%= glp("jcmsplugin.rainbow.app.conversation.outgoingCall") %>';
    var missedCall= '<%= glp("jcmsplugin.rainbow.app.conversation.missedCall") %>';
    var CalledU= '<%= glp("jcmsplugin.rainbow.app.conversation.CalledU") %>';
    var UCalled= '<%= glp("jcmsplugin.rainbow.app.conversation.UCalled") %>';
    var org= '<%= glp("jcmsplugin.rainbow.app.conversation.org") %>';
    var Mem= '<%= glp("jcmsplugin.rainbow.app.conversation.Mem") %>';
    var infos= '<%= glp("jcmsplugin.rainbow.app.conversation.infos") %>';
    var email= '<%= glp("jcmsplugin.rainbow.app.conversation.email") %>';
    var country= '<%= glp("jcmsplugin.rainbow.app.conversation.country") %>';
    var hangUp = '<%= glp("jcmsplugin.rainbow.app.conversation.endCall") %>';
    
</script>

<%
String accountJSON = RainbowAuthenticator.getAccount(loggedMember);
if (token == null || token.equals("null") || accountJSON == null || accountJSON.isEmpty()) {
    response.sendRedirect("https://sandbox.openrainbow.com/api/rainbow/authentication/v1.0/oauth/authorize?response_type=token&client_id=" + applicationID + "&redirect_uri=" + java.net.URLEncoder.encode("https://localhost:8080/jcms/plugins/newRainbowPlugin/jsp/app/afterLog.jsp", "UTF-8") + "&scope=all");
} else {
	JSONObject accountObj = new JSONObject(accountJSON);
	String defaultAvatar = accountObj.getString("defaultAvatar");
    String avatarSrc = accountObj.optString("avatarSrc");
    String avatar = defaultAvatar != null ? defaultAvatar : avatarSrc;
    request.setAttribute("avatar", avatar);
      
        %>
<% 
jcmsContext.addCSSHeader("/plugins/newRainbowPlugin/css/chat.css"); 
jcmsContext.addCSSHeader("/plugins/newRainbowPlugin/css/scroll.css"); 
%>

<%@ include file='/jcore/doHeader.jspf' %>

<div class="chat-container">
    <aside class="chat-sidebar">
        <%@ include file='/plugins/newRainbowPlugin/jsp/app/chat-sidebar.jspf' %>
    </aside>
    <div class="chat-content">
        <%@ include file='/plugins/newRainbowPlugin/jsp/app/chat-content.jspf' %>
    </div>
</div>
    <script type="module" src="/jcms/plugins/newRainbowPlugin/js/index.js" defer></script>

<%@ include file='/jcore/doFooter.jspf' %>
<%
    }
%>
