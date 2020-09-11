package com.usc.webtech.newsapplicationv2;

import android.os.Build;
import android.os.Bundle;

import androidx.annotation.RequiresApi;
import androidx.fragment.app.Fragment;

import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;

import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.github.mikephil.charting.charts.LineChart;
import com.github.mikephil.charting.components.Legend;
import com.github.mikephil.charting.components.LegendEntry;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.github.mikephil.charting.interfaces.datasets.ILineDataSet;
import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.textfield.TextInputLayout;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;


/**
 * A simple {@link Fragment} subclass.
 * Use the {@link TrendingFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class TrendingFragment extends Fragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    private LineChart mChart;


    public TrendingFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment TrendingFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static TrendingFragment newInstance(String param1, String param2) {
        TrendingFragment fragment = new TrendingFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
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

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View layout = (View) inflater.inflate(R.layout.fragment_trending, container, false);
        mChart = (LineChart) layout.findViewById(R.id.chart1);
         final EditText trendTextInput = layout.findViewById(R.id.trending_text_input);
        String text = trendTextInput.getHint().toString();
        setChartData(text);
        trendTextInput.setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                if(keyCode == KeyEvent.KEYCODE_ENTER && event.getAction()==KeyEvent.ACTION_DOWN){
                    final String text = trendTextInput.getText().toString();
                    setChartData(text);
                }
                return false;
            }
        });

        return layout;
    }

    public void setChartData(final String text){
        RequestQueue queue = Volley.newRequestQueue(getActivity());
        String url = "https://hw9backendandroid.wl.r.appspot.com" + "/getTrends?trend="+text;
        StringRequest stringRequest = new StringRequest(url,
                new Response.Listener<String>() {
                    @RequiresApi(api = Build.VERSION_CODES.O)
                    @Override
                    public void onResponse(String response) {
                        try {
                            JSONArray trendData = new JSONObject(response).getJSONArray("values");
                            List<Entry> entries1 = new ArrayList<>();
                            for (int i = 0; i < trendData.length(); i++) {
                                entries1.add(new Entry(i, trendData.getInt(i)));
                            }
                            LineDataSet dataSet1 = new LineDataSet(entries1, "Trending Chart for "+text);
                            dataSet1.setColor(R.color.selecetedColor);
                            dataSet1.setCircleColor(R.color.selecetedColor);
                            dataSet1.setCircleHoleColor(R.color.selecetedColor);
                            dataSet1.setColor(R.color.selecetedColor);
                            List<ILineDataSet> dataSets = new ArrayList<>();
                            dataSets.add(dataSet1);
                            LineData data = new LineData(dataSets);
                            mChart.setData(data);
                            mChart.invalidate();
                            mChart.getXAxis().setDrawGridLines(false);
                            mChart.getAxisLeft().setDrawGridLines(false);
                            mChart.getAxisRight().setDrawGridLines(false);
                            mChart.getAxisLeft().setDrawAxisLine(false);
                            Legend legend = mChart.getLegend();
                            legend.setEnabled(true);
                            legend.setFormSize(21f);
                            legend.setTextSize(13f);
                            legend.setTextColor(R.color.black);
                            //legend.setTextSize(25f);
                            data.setValueTextSize(9f);
//                            legend.setTextSize(17f);
//                            legend.setEnabled(true);
                        } catch (JSONException ex) {
                            Log.e("Top News Error:", "Could not parse TrendData");
                        }
                        // Display the first 500 characters of the response string.

                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.e("Trending Data Error::", "Could not get response from the API");
            }
        });

// Add the request to the RequestQueue.
        queue.add(stringRequest);
    }

}
