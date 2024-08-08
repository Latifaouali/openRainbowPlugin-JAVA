package com.jalios.jcmsplugin.rainbow;

import com.jalios.jcms.alert.AlertBuilder;
import com.jalios.jcms.alert.Alert;

import java.util.Collections;
import java.util.Set;

import com.jalios.jcms.Member;

public class NotificationService {
    public void sendNotification(String domain, String alertName, String data,  Member loggedMember) {
        AlertBuilder alertBuilder = new AlertBuilder(Alert.Level.ACTION, domain, alertName);
        Set<Member> memberSet = Collections.singleton(loggedMember);
        alertBuilder.sendAlert(memberSet);
    }
}
