<%@ include file='/jcore/doInitPage.jspf' %>
<%@ include file="/front/app/doAppCommon.jspf" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.jalios.jcmsplugin.rainbow.RainbowAuthenticator" %>
<%@ page import="javax.servlet.http.HttpServletRequest" %>
<%@ page import="javax.servlet.http.HttpServletResponse" %>
<%@ page import="com.jalios.jcms.context.JcmsContext" %>
<%@ page import="com.jalios.jcms.Channel" %>
<%@ page import="com.jalios.jcms.Member" %>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/es5-shim/4.5.9/es5-shim.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/es6-promise/4.0.5/es6-promise.min.js"></script>
<script src="//code.jquery.com/jquery-2.1.3.min.js"></script>
<script src="//cdn.jsdelivr.net/momentjs/2.15.1/moment-with-locales.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/angular.js/1.7.5/angular.min.js"></script>
<script src="plugins/newRainbowPlugin/js/vendors-sdk.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/es5-shim/4.5.9/es5-shim.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/es6-promise/4.0.5/es6-promise.min.js"></script>
<script src="//code.jquery.com/jquery-2.1.3.min.js"></script>
<script src="https://code.jquery.com/jquery-2.1.3.min.js"></script>
<script src="//cdn.jsdelivr.net/momentjs/2.15.1/moment-with-locales.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/angular.js/1.7.5/angular.min.js"></script>
<script src="/jcms/plugins/newRainbowPlugin/js/vendors-sdk.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/es5-shim/4.5.9/es5-shim.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/es6-promise/4.0.5/es6-promise.min.js"></script>
<script src="//code.jquery.com/jquery-2.1.3.min.js"></script>
<script src="https://code.jquery.com/jquery-2.1.3.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jwt-decode/3.1.2/index.min.js"></script>
<script src="/jcms/plugins/newRainbowPlugin/js/tokenHandler.js"></script>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<style>
        #logo-container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        #logo {
            width: 100%;
            max-height: 100px;
        }
</style>
<%
request.setAttribute("loggedMember", RainbowAuthenticator.getCurrentLoggedInMember(request));
%>
<script>
    var applicationID = '<%= RainbowAuthenticator.getApplicationID() %>';
    var secretKey = '<%= RainbowAuthenticator.getSecretKey() %>';
</script>
<script type="module" src="/jcms/plugins/newRainbowPlugin/js/authHandler.js"></script>

<div id="loader"></div>
<div id="logo-container">
    <img id="logo" src="https://web-sandbox.openrainbow.com/cacheV2/images/logo__rainbow--text.svg" alt="Rainbow Logo">
</div>
<script src="/jcms/plugins/newRainbowPlugin/js/loading.js"></script>
