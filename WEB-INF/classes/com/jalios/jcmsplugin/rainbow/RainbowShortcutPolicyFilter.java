package com.jalios.jcmsplugin.rainbow;

import com.jalios.jcms.Channel;
import com.jalios.jcms.shortcut.AbstractShortcut;
import com.jalios.jcms.shortcut.BasicShortcutPolicyFilter;

public class RainbowShortcutPolicyFilter extends BasicShortcutPolicyFilter {

	  @Override
	  public String getShortcutInfoAsync(AbstractShortcut shortcut) {
	    if (shortcut != Channel.getChannel().getData("$id.shortcut.jcmsplugin.rainbow")) {
	      return null;
	    }
	    return "plugins/newRainbowPlugin/jsp/app/ShortcutInfo.jsp";
	  }
	}
