package com.jalios.jcmsplugin.rainbow;


import com.jalios.jcms.shortcut.AsyncShortcutHandler;
import com.jalios.jcms.shortcut.BadgeLevel;
import com.jalios.jcms.shortcut.ShortcutInfo;

import javax.servlet.ServletContext;

import com.jalios.jcms.Channel;

public class RainbowAsyncShortcutHandler extends AsyncShortcutHandler {

    @Override
    public ShortcutInfo getShortcutInfo() {
        int missedCount = fetchMissedMessageCountFromApplicationContext();
        if (missedCount == 0)
            return null;

        ShortcutInfo info = new ShortcutInfo();
        info.setBadgeText(String.valueOf(missedCount), new Object[0]);
        info.setBadgeLevel(BadgeLevel.INFO);
        info.setUrl("plugins/newRainbowPlugin/jsp/app/index.jsp");
        return info;
    }

    private int fetchMissedMessageCountFromApplicationContext() {
        try {
        	ServletContext context = Channel.getChannel().getServletContext();
            Integer missedCount = (Integer) context.getAttribute("missedCounter");
            if (missedCount != null) {
                return missedCount;
            } else {
                return 0;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return 0; // Handle error case
        }
    }
}