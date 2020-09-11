package com.usc.webtech.newsapplicationv2;

import android.os.Build;

import androidx.annotation.RequiresApi;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Date;

public class TopNewsCard {

    private String imageUrl;
    private String title;
    private String newsStatus;
    private String newsType;
    private String articleId;
    private String webPubDate;
    private String articleUrl;


    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getArticleId() {
        return articleId;
    }

    public void setArticleId(String articleId) {
        this.articleId = articleId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getNewsStatus() {
        return newsStatus;
    }

    public void setNewsStatus(String newsStatus) {
        this.newsStatus = newsStatus;
    }

    public String getNewsType() {
        return newsType;
    }

    public void setNewsType(String newsType) {
        this.newsType = newsType;
    }

    public String getWebPubDate() {
        return webPubDate;
    }

    public String getArticleUrl() {
        return articleUrl;
    }

    public void setArticleUrl(String articleUrl) {
        this.articleUrl = articleUrl;
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    public void setWebPubDate(String webPubDate) {
        this.webPubDate = formatDate(webPubDate);
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    public void setTimeStampFrom(String date){
        ZonedDateTime  webPubDate = ZonedDateTime.parse(date);
        Instant result = Instant.from(webPubDate);
        ZonedDateTime webDate= result.atZone(ZoneId.of("America/Los_Angeles"));
        LocalDateTime webConvDate = webDate.toLocalDateTime();
        ZonedDateTime current = ZonedDateTime.now(ZoneId.of("America/Los_Angeles"));
        LocalDateTime currentDate = current.toLocalDateTime();
        long seconds = webConvDate.until( currentDate, ChronoUnit.SECONDS );
        if(seconds/(24*3600) >= 1){
            int days = (int)seconds/(24*3600);
            this.newsStatus = days+"d ago";
        }
        else if(seconds/3600>=1){
            int hours = (int)seconds/3600;
            this.newsStatus =  hours+"h ago";
        }else if(seconds/60>=1){
            int min = (int)seconds/60;
            this.newsStatus = min+"m ago";
        }else{
            this.newsStatus = seconds+"s ago";
        }
    }


    @RequiresApi(api = Build.VERSION_CODES.O)
    public String formatDate(String date) {
        ZonedDateTime dat = ZonedDateTime.parse(date);
        dat = dat.withZoneSameInstant( ZoneId.of( "America/Los_Angeles" ));
        return dat.format(DateTimeFormatter.ofPattern("dd MMM"));
    }

}

