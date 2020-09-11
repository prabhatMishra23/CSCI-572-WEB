package com.usc.webtech.newsapplicationv2;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.cardview.widget.CardView;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.fonts.FontFamily;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.text.Html;
import android.text.method.LinkMovementMethod;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.bumptech.glide.Glide;
import com.google.gson.Gson;

import org.json.JSONException;
import org.json.JSONObject;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;

public class DetailedCardActivity extends AppCompatActivity {

    Toolbar myToolbar;
    String articleId;
    Context ctx;
    Menu menu;
    String shareText;
    TopNewsCard card;
    SharedPreferences cache;
    private ProgressBar progView;
    private TextView fetchText;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setTheme(R.style.DetailedAppTheme);
        setContentView(R.layout.activity_detailed_card);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        cache = this.getSharedPreferences("bookmarks",Context.MODE_PRIVATE);
        ctx = this;
        getFullArticlefromApi();
        //setSupportActionBar(myToolbar);

    }

    private void getFullArticlefromApi() {
        Intent intent = getIntent();
        articleId = intent.getStringExtra("articleId");
        RequestQueue queue = Volley.newRequestQueue(this);
        progView = (ProgressBar) findViewById(R.id.top_news_progressbar);
        fetchText = (TextView) findViewById(R.id.progress_text);
        String url ="https://hw9backendandroid.wl.r.appspot.com/"+"article?newsType=Guardian&id="+articleId;
// Request a string response from the provided URL.
        StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
                new Response.Listener<String>() {
                    @RequiresApi(api = Build.VERSION_CODES.O)
                    @Override
                    public void onResponse(String response) {
                        try{
                            JSONObject articleDetails = new JSONObject(response);
                            card = new TopNewsCard();
                            fetchText.setVisibility(View.GONE);
                            progView.setVisibility(View.GONE);
                            card.setArticleId(articleId);
                            String title =  articleDetails.getString("title");
                            card.setTitle(title);
                            ImageView imView = (ImageView) findViewById(R.id.det_card_img);
                            String image = "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png";
                            if(!articleDetails.getString("image").equals("")){
                                image = articleDetails.getString("image");
                                Glide.with(ctx).load(image).into(imView);
                            }else{
                                imView.setImageResource(R.drawable.fallback_logo);
                            }
                            card.setImageUrl(image);
                            String date =  articleDetails.getString("date");
                            card.setWebPubDate(date);
                            String description = articleDetails.getString("description");
                            String fullArticleUrl = articleDetails.getString("url");
                            String section = articleDetails.getString("section");
                            card.setNewsType(section);
                            CardView view = (CardView) findViewById(R.id.detailedCardView);
                            view.setCardBackgroundColor(Color.WHITE);
                            TextView detailed_text = findViewById(R.id.det_card_text);
                            TextView detailed_title = findViewById(R.id.det_card_title);
                            detailed_title.setTextColor(Color.BLACK);
                            detailed_title.setTextSize(23);
                            TextView detailed_date = findViewById(R.id.det_date);
                            TextView detailed_section = findViewById(R.id.det_section);
                            detailed_title.setText(title);
                            detailed_date.setText(formatDate(date));
                            detailed_section.setText(section);
                            detailed_text.setTextSize(16);
                            detailed_text.setText(Html.fromHtml(description));
                            TextView linktext = findViewById(R.id.det_card_link);
                            linktext.setText(Html.fromHtml("<a style=\""+"color:#37353C\""+"href=\""+ fullArticleUrl + "\">"+"View Full Article"+"</a>"));
                            linktext.setTextSize(20);
                            linktext.setClickable(true);
                            linktext.setMovementMethod (LinkMovementMethod.getInstance());
                            getSupportActionBar().setTitle(title);
                            menu.findItem(R.id.det_article_share).setVisible(true);
                            menu.findItem(R.id.det_article_bookmark).setVisible(true);
                            shareText = "Checkout this link "+fullArticleUrl+" #CSCI571NewsSearch";
                        }catch(JSONException ex){
                            Log.e("DetailedCard::","Could not parse article Data");
                        }
                        // Display the first 500 characters of the response string.

                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.e("DetailedCard::","Could not get response from the API");
            }
        });

// Add the request to the RequestQueue.
        queue.add(stringRequest);

    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    private String formatDate(String date) {
        ZonedDateTime dat = ZonedDateTime.parse(date);
        dat = dat.withZoneSameInstant( ZoneId.of( "America/Los_Angeles" ));
        return dat.format(DateTimeFormatter.ofPattern("dd MMM yyyy"));
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        this.menu = menu;
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.detailed_menu, menu);
        if(cache.contains(articleId)){
        menu.getItem(0).setIcon(ContextCompat.getDrawable(this, R.drawable.baseline_bookmark_36));
        }
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle presses on the action bar items
        switch (item.getItemId()) {
            case R.id.det_article_bookmark:
                if(!cache.contains(articleId)) {
                    item.setIcon(ContextCompat.getDrawable(this, R.drawable.baseline_bookmark_36));
                    addToCache(card);
                }else{
                    item.setIcon(ContextCompat.getDrawable(this, R.drawable.baseline_bookmark_border_36));
                    removeFromCache(articleId);
                }
                //composeMessage();
                return true;
            case R.id.det_article_share:
                //showProfileView();
                callTwitterWebIntent();
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    private void callTwitterWebIntent() {
            String tweetUrl = "https://twitter.com/intent/tweet?text="+Uri.encode(shareText);
            Uri generateduri = Uri.parse(tweetUrl);
            Intent shareIntent = new Intent(Intent.ACTION_VIEW, generateduri);
            ctx.startActivity(shareIntent);
    }

    public boolean onSupportNavigateUp(){
        finish();
        return true;
    }


    private void removeFromCache(String id) {
        SharedPreferences cache = this.getSharedPreferences("bookmarks",Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = cache.edit();
        editor.remove(id);
        // editor.remove(card.getArticleId()+"fullCard");
        Toast.makeText(ctx,"Removing "+card.getTitle(),Toast.LENGTH_LONG).show();
        editor.commit();
    }

    private void addToCache(TopNewsCard card) {
        SharedPreferences cache = this.getSharedPreferences("bookmarks",Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = cache.edit();
        // editor.putString(card.getArticleId(),"true");
        Gson gson = new Gson();
        String json = gson.toJson(card);
        editor.putString(card.getArticleId(),json);
        editor.commit();
        Toast.makeText(ctx,"Saving "+card.getTitle(),Toast.LENGTH_LONG).show();
    }

}
