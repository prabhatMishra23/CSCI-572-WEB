package com.usc.webtech.newsapplicationv2.sectionsFragment;

import android.content.Context;
import android.os.Build;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.usc.webtech.newsapplicationv2.R;
import com.usc.webtech.newsapplicationv2.TopNewsAdapter;
import com.usc.webtech.newsapplicationv2.TopNewsCard;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link WorldFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class WorldFragment extends Fragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";
    private RecyclerView cardView;
    private TopNewsAdapter adapter;
    private Context ctx;
    List<TopNewsCard> cards = new ArrayList<TopNewsCard>();

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    public WorldFragment() {
        this.ctx = this.getContext();
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment WorldFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static WorldFragment newInstance(String param1, String param2) {
        WorldFragment fragment = new WorldFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View layout = (View) inflater.inflate(R.layout.fragment_section, container, false);

        Bundle args = getArguments();
        cardView = (RecyclerView) layout.findViewById(R.id.section_card_list);
        getDataFromApi(args);
        adapter = new TopNewsAdapter(getActivity(), cards);
        cardView.setAdapter(adapter);
        cardView.setLayoutManager(new LinearLayoutManager(getActivity()));
//        }
        Log.i(" World ::"," Returning layout view inflated");
        return layout;
    }


    public void getDataFromApi(Bundle args) {
        Log.i("Inside World API","Fetching..");
        String url = "https://hw9backendandroid.wl.r.appspot.com/" + "world?type=Guardian";
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
                                card.setImageUrl(((JSONObject) guardianData.get(i)).getString("image"));
                                card.setTimeStampFrom(((JSONObject) guardianData.get(i)).getString("date"));
                                card.setNewsType(((JSONObject) guardianData.get(i)).getString("section"));
                                card.setArticleId(((JSONObject) guardianData.get(i)).getString("detailedCardId"));
                                cards.add(card);
                            }
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
        RequestQueue queue = Volley.newRequestQueue(getContext());
        queue.add(stringRequest);
    }

}
