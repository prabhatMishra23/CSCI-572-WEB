package com.usc.webtech.newsapplicationv2;

import android.content.Context;
import android.os.Build;
import android.os.Bundle;

import androidx.annotation.RequiresApi;
import androidx.cardview.widget.CardView;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.RenderProcessGoneDetail;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;


/**
 * A simple {@link Fragment} subclass.
 * Use the {@link TopNewsFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class TopNewsFragment extends Fragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    private RecyclerView cardView;
    private TextView fetchText;
    List<TopNewsCard> cards = new ArrayList<TopNewsCard>();
    private SwipeRefreshLayout swipeRefreshLayout;
    private ProgressBar progView;

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    private Context mcontext;
    private TopNewsAdapter adapter;

    public TopNewsFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment TopNewsFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static TopNewsFragment newInstance(String param1, String param2) {
        TopNewsFragment fragment = new TopNewsFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.mcontext = getActivity();
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View layout = inflater.inflate(R.layout.fragment_top_news, container, false);
        Bundle args = getArguments();
        if(args!=null && args.getString("type")!=null) {
            CardView card = (CardView) layout.findViewById(R.id.card_view);
            RelativeLayout imageView = (RelativeLayout) layout.findViewById(R.id.weatherImage);
            switch(args.getString("type")){
                case "Clouds":imageView.setBackgroundResource(R.drawable.cloudy_weather);
                    break;
                case "Clear" :imageView.setBackgroundResource(R.drawable.clear_weather);
                    break;
                case "Snow" : imageView.setBackgroundResource(R.drawable.snowy_weather);
                    break;
                case "Rain" : imageView.setBackgroundResource(R.drawable.rainy_weather);
                    break;
                case "Drizzle" : imageView.setBackgroundResource(R.drawable.rainy_weather);
                    break;
                case "Thunderstorm" : imageView.setBackgroundResource(R.drawable.rainy_weather);
                    break;
                default:imageView.setBackgroundResource(R.drawable.sunny_weather);
                    break;
            }

            TextView weatherCity = (TextView) layout.findViewById(R.id.weatherCity);
            TextView weatherState = (TextView) layout.findViewById(R.id.weatherState);
            TextView weatherTemp = (TextView) layout.findViewById(R.id.weatherTemp);
            TextView weatherType = (TextView) layout.findViewById(R.id.weatherType);
            weatherCity.setText(args.getString("city"));
            weatherState.setText(args.getString("state"));
            weatherTemp.setText(args.getString("temp") + " \u2103");
            weatherType.setText(args.getString("type"));
        }

//        if(args.getString("cardArray")!=null) {
            ///Recycler View Code
        cardView = (RecyclerView) layout.findViewById(R.id.card_list);
        progView = (ProgressBar) layout.findViewById(R.id.top_news_progressbar);
        fetchText = (TextView) layout.findViewById(R.id.progress_text);
        getDataFromApi();
        swipeRefreshLayout = (SwipeRefreshLayout) layout.findViewById(R.id.swipeRefreshCard);
        swipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener(){

            @Override
            public void onRefresh() {
                cards.clear();
                getDataFromApi();
                swipeRefreshLayout.setRefreshing(false);
            }
        });
        adapter = new TopNewsAdapter(getActivity(), cards);
        cardView.setAdapter(adapter);
        cardView.setLayoutManager(new LinearLayoutManager(getActivity()));
//        }
        Log.i("Buisness::","Returning layout view inflated");
        return layout;
    }


    public void getDataFromApi() {
        RequestQueue queue = Volley.newRequestQueue(getActivity());
        Log.i("Inside Buisness API","Fetching..");
        String url="https://hw9backendandroid.wl.r.appspot.com/homeNews";
        StringRequest stringRequest = new StringRequest(url,
                new Response.Listener<String>() {
                    @RequiresApi(api = Build.VERSION_CODES.O)
                    @Override
                    public void onResponse(String response) {
                        try {
                            JSONArray guardianData = new JSONArray(response);
                            for (int i = 0; i < guardianData.length(); i++) {
                                TopNewsCard card = new TopNewsCard();
                                card.setTitle(((JSONObject) guardianData.get(i)).getString("title"));
                                if(((JSONObject)guardianData.get(i)).getString("image").equals("")){
                                    card.setImageUrl("https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png");
                                }else{
                                    card.setImageUrl(((JSONObject)guardianData.get(i)).getString("image"));
                                }
                                card.setTimeStampFrom(((JSONObject) guardianData.get(i)).getString("date"));
                                card.setWebPubDate(((JSONObject) guardianData.get(i)).getString("date"));
                                card.setNewsType(((JSONObject) guardianData.get(i)).getString("section"));
                                card.setArticleId(((JSONObject) guardianData.get(i)).getString("articleId"));
                                card.setArticleUrl(((JSONObject) guardianData.get(i)).getString("url"));
                                cards.add(card);
                            }
                            progView.setVisibility(View.GONE);
                            fetchText.setVisibility(View.GONE);
                            adapter.notifyDataSetChanged();
                        } catch (JSONException ex) {
                            Log.e("Top News Error:", "Could not parse Guardian News Data");
                        }
                        // Display the first 500 characters of the response string.

                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.e("Top News Error::", "Could not get response from the API");
            }
        });

// Add the request to the RequestQueue.
        queue.add(stringRequest);
    }

    @Override
    public void onResume() {
        super.onResume();
        if(adapter!=null){
            adapter.notifyDataSetChanged();
        }
    }
}
