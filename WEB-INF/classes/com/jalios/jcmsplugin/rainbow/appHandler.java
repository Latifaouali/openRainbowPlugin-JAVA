package com.jalios.jcmsplugin.rainbow;

import com.jalios.jcms.taglib.settings.ControlSettings;
import com.jalios.jcms.taglib.settings.impl.EnumerateSettings;

public class appHandler {
	  public enum View {
		    CALL,CONTACT, SETTING;
		  }
	  
	  protected View view;
	 
	 public String getAppUrl() {
		    return "plugins/newRainbowPlugin/jsp/app/index.jsp";
	}
	  private String getViewUrl(View view) {
		    return String.valueOf(getAppUrl()) + "?view=" + view;
	}
	  public String getCallUrl() {
		    return getViewUrl(View.CALL);
		  }
		  
		  public String getContactUrl() {
		    return getViewUrl(View.CONTACT);
		  }
		  
		  public String getSettibngUrl() {
		    return getViewUrl(View.SETTING);
		  }  
		  
	  public void setView(String v) {
		try {
		   this.view = View.valueOf(v);
		}
		  catch(IllegalArgumentException ignore) {
		}
	}
	  
	  public boolean showCall() {
		    return view == View.CALL;
		  }

		  public boolean showContact() {
		    return view == View.CONTACT ;
		  }
		  
		  public boolean showSetting() {
		    return view == View.SETTING;
		  }
		    
	  public ControlSettings getViewSettings() {
		    EnumerateSettings settings = new EnumerateSettings()
		        .name("view")
		        .value(view)
		        .enumLabels("Call", "CONTACT", "SETTING")
		        .enumValues(View.CALL.toString(), View.CONTACT.toString(), View.SETTING.toString())
		        .onChange("ajax-refresh");

		    return settings;
		  }  
}
