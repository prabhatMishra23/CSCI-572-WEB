package com.usc.webtech.newsapplicationv2;

import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;

import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.android.material.snackbar.Snackbar;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import android.util.Log;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class SearchableActivity extends AppCompatActivity {

    private Context context;
    private RecyclerView view;
    private TopNewsAdapter adapter;
    private ProgressBar progView;
    private SwipeRefreshLayout swipeRefreshLayout;
    private TextView fetchText;
    private List<TopNewsCard> cards;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setTheme(R.style.DetailedAppTheme);
        context = this;
        setContentView(R.layout.activity_searchable);
        Intent intent = getIntent();
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        final String query = intent.getStringExtra("searchQuery");
        cards = new ArrayList<TopNewsCard>();
        view = (RecyclerView) findViewById(R.id.search_card_list);
        adapter = new TopNewsAdapter(context,cards);
        getDataFromApi(query);
        getSupportActionBar().setTitle("Search Results for "+query);
        view.setAdapter(adapter);
        view.setLayoutManager(new LinearLayoutManager(this));
        progView = (ProgressBar) findViewById(R.id.top_news_progressbar);
        fetchText = (TextView) findViewById(R.id.progress_text);
        swipeRefreshLayout = (SwipeRefreshLayout) findViewById(R.id.swipeRefreshCard);
        swipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener(){

            @Override
            public void onRefresh() {
                cards.clear();
                getDataFromApi(query);
                swipeRefreshLayout.setRefreshing(false);
            }
        });

    }

    private void getDataFromApi(String query) {
        String url = "https://hw9backendandroid.wl.r.appspot.com" + "/search?q="+query;
        StringRequest stringRequest = new StringRequest(url,
                new Response.Listener<String>() {
                    @RequiresApi(api = Build.VERSION_CODES.O)
                    @Override
                    public void onResponse(String response) {
                        try{
                            JSONArray guardianData = new JSONArray(response);
                            cards.clear();
                            for(int i=0;i<guardianData.length();i++) {
                                TopNewsCard card = new TopNewsCard();
                                card.setTitle(((JSONObject) guardianData.get(i)).getString("title"));
                                if (((JSONObject) guardianData.get(i)).getString("image").equals("")) {
                                    card.setImageUrl("https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png");
                                } else {
                                    card.setImageUrl(((JSONObject) guardianData.get(i)).getString("image"));
                                }
                                card.setTimeStampFrom(((JSONObject) guardianData.get(i)).getString("date"));
                                card.setWebPubDate(((JSONObject) guardianData.get(i)).getString("date"));
                                card.setNewsType(((JSONObject) guardianData.get(i)).getString("section"));
                                card.setArticleId(((JSONObject) guardianData.get(i)).getString("detailedCardId"));
                                card.setArticleUrl(((JSONObject) guardianData.get(i)).getString("url"));
                                cards.add(card);
                            }
                            progView.setVisibility(View.GONE);
                            fetchText.setVisibility(View.GONE);
                            adapter.notifyDataSetChanged();
                        }catch(JSONException ex){
                            Log.e("Top News Error:","Could not parse Guardian News Data");
                        }
                        // Display the first 500 characters of the response string.

                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.e("Top News Error::","Could not get response from the API");
            }
        });

        // Add the request to the RequestQueue.
        RequestQueue queue = Volley.newRequestQueue(this);
        queue.add(stringRequest);

    }

    public boolean onSupportNavigateUp(){
        finish();
        return true;
    }


    @Override
    protected void onResume() {
        super.onResume();
        if(adapter!=null){
            adapter.notifyDataSetChanged();
        }

    }
}
