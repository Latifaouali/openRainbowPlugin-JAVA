package com.jalios.jcmsplugin.rainbow;

import com.jalios.jcms.property.PropertyManager;
import com.jalios.util.LangProperties;

import com.jalios.jcms.Member;
import com.jalios.jcms.context.JcmsContext;

//import com.jalios.jcms.dbmember.DBMember;
//import com.jalios.jcms.dbmember.DBMember.Fields;
public class RainbowAuthenticator {
	private static final String PROP_PREFIX = "jcmsplugin.rainbow";   
 // Method to retrieve email from properties
    public static String getApplicationID() {
        PropertyManager propertyManager = PropertyManager.getInstance();
        LangProperties properties = propertyManager.getProperties(PROP_PREFIX);
        return properties.getProperty("jcmsplugin.rainbow.applicationID");
    }
    // Method to retrieve password from properties
    public static String getSecretKey() {
        PropertyManager propertyManager = PropertyManager.getInstance();
        LangProperties properties = propertyManager.getProperties(PROP_PREFIX);
        return properties.getProperty("jcmsplugin.rainbow.secretkey");
    }

    public static Member getCurrentLoggedInMember(javax.servlet.http.HttpServletRequest request) {
        JcmsContext ctx = (JcmsContext) request.getAttribute("jcmsContext");
        Member member = ctx.getLoggedMember();

        return member;
    }


    
    public static String getTokenRainbow(Member member) {
		return (String) member.getExtraData("extra.Member.jcmsplugin.rainbow.Token");	
    }
    
    public static  void setTokenRainbow(Member member,String accessToken) {
        member.setExtraData("extra.Member.jcmsplugin.rainbow.Token", accessToken);
    }
    
    public static String getAccount(Member member) {
		return (String) member.getExtraData("extra.Member.jcmsplugin.rainbow.Account");	
    }
    
    public static  void setAccount(Member member,String Account) {
        member.setExtraData("extra.Member.jcmsplugin.rainbow.Account", Account);
    }
    
}
