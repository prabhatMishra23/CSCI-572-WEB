package com.usc.webtech.newsapplicationv2.sectionsFragment;

import android.os.Build;
import android.os.Bundle;

import androidx.annotation.RequiresApi;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.usc.webtech.newsapplicationv2.R;
import com.usc.webtech.newsapplicationv2.TopNewsAdapter;
import com.usc.webtech.newsapplicationv2.TopNewsCard;
import com.usc.webtech.newsapplicationv2.TopNewsFragment;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link SectionFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class SectionFragment extends Fragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    private ProgressBar progView;

    private SwipeRefreshLayout swipeRefreshLayout;

    private RecyclerView cardView;
    private TopNewsAdapter adapter;
    private TextView fetchText;
    List<TopNewsCard> cards;

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    public SectionFragment() {
        // Required empty public constructor
    }

    public static SectionFragment newInstance(int position) {
        SectionFragment fragment = new SectionFragment();
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
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
        View layout = (View)inflater.inflate(R.layout.fragment_section, container, false);

        final Bundle args = getArguments();
        cards = new ArrayList<TopNewsCard>();
        cardView = (RecyclerView) layout.findViewById(R.id.section_card_list);
        progView = (ProgressBar) layout.findViewById(R.id.top_news_progressbar);
        fetchText = (TextView) layout.findViewById(R.id.progress_text);
        getDataFromApi(args);
        swipeRefreshLayout = (SwipeRefreshLayout) layout.findViewById(R.id.swipeRefreshCard);
        swipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener(){

            @Override
            public void onRefresh() {
                //cards.clear();
                getDataFromApi(args);
                swipeRefreshLayout.setRefreshing(false);
            }
        });
        adapter = new TopNewsAdapter(getActivity(), cards);
        cardView.setAdapter(adapter);
        cardView.setLayoutManager(new LinearLayoutManager(getActivity()));
//        }
        return layout;
    }


    public void getDataFromApi(Bundle args) {
        //cards = new ArrayList<TopNewsCard>();
        //cards.clear();
//        progView.setVisibility(View.VISIBLE);
//        fetchText.setVisibility(View.VISIBLE);
        String url="";
        if(args.get("sectionType") == "World" ) {
            url = "https://hw9backendandroid.wl.r.appspot.com" + "/world?type=Guardian";
        }else if(args.get("sectionType") == "Politics"){
            url = "https://hw9backendandroid.wl.r.appspot.com" + "/politics?type=Guardian";
        }else if(args.get("sectionType") == "Business"){
            url = "https://hw9backendandroid.wl.r.appspot.com" + "/business?type=Guardian";
        }else if(args.get("sectionType") == "Sports"){
            url = "https://hw9backendandroid.wl.r.appspot.com" + "/sports?type=Guardian";
        }else if(args.get("sectionType") == "Technology"){
            url = "https://hw9backendandroid.wl.r.appspot.com" + "/technology?type=Guardian";
        }else if(args.get("sectionType") == "Science"){
            url = "https://hw9backendandroid.wl.r.appspot.com" + "/science?type=Guardian";
        }
        StringRequest stringRequest = new StringRequest(url,
                new Response.Listener<String>() {
                    @RequiresApi(api = Build.VERSION_CODES.O)
                    @Override
                    public void onResponse(String response) {
                        try{
                            JSONArray guardianData = new JSONArray(response);
                            cards.clear();
                            for(int i=0;i<guardianData.length();i++){
                                TopNewsCard card = new TopNewsCard();
                                card.setTitle(((JSONObject)guardianData.get(i)).getString("title"));
                                if(((JSONObject)guardianData.get(i)).getString("image").equals("")){
                                    card.setImageUrl("https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png");
                                }else{
                                    card.setImageUrl(((JSONObject)guardianData.get(i)).getString("image"));
                                }
                                card.setTimeStampFrom(((JSONObject)guardianData.get(i)).getString("date"));
                                card.setNewsType(((JSONObject)guardianData.get(i)).getString("section"));
                                card.setArticleId(((JSONObject)guardianData.get(i)).getString("detailedCardId"));
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
        RequestQueue queue = Volley.newRequestQueue(getActivity());
        queue.add(stringRequest);
    }
}
