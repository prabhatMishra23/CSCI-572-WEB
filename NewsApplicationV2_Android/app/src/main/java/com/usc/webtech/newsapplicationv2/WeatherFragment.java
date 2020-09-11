//package com.usc.webtech.newsapplicationv2;
//
//import android.Manifest;
//import android.content.Context;
//import android.content.pm.PackageManager;
//import android.location.Address;
//import android.location.Geocoder;
//import android.location.Location;
//import android.location.LocationManager;
//import android.os.Bundle;
//import android.util.Log;
//import android.view.LayoutInflater;
//import android.view.View;
//import android.view.ViewGroup;
//import android.widget.RelativeLayout;
//import android.widget.Switch;
//import android.widget.TextView;
//
//import androidx.cardview.widget.CardView;
//import androidx.core.app.ActivityCompat;
//import androidx.core.content.ContextCompat;
//import androidx.fragment.app.Fragment;
//import androidx.fragment.app.FragmentManager;
//import androidx.fragment.app.FragmentTransaction;
//
//import com.android.volley.Request;
//import com.android.volley.RequestQueue;
//import com.android.volley.Response;
//import com.android.volley.VolleyError;
//import com.android.volley.toolbox.StringRequest;
//import com.android.volley.toolbox.Volley;
//
//import org.json.JSONException;
//import org.json.JSONObject;
//
//import java.util.List;
//import java.util.Locale;
//
///**
// * A simple {@link Fragment} subclass.
// * Use the {@link WeatherFragment#newInstance} factory method to
// * create an instance of this fragment.
// */
//public class WeatherFragment extends Fragment {
//    // TODO: Rename parameter arguments, choose names that match
//    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
//    private static final String ARG_PARAM1 = "param1";
//    private static final String ARG_PARAM2 = "param2";
//
//    private Context appContext;
//
//    // TODO: Rename and change types of parameters
//    private String mParam1;
//    private String mParam2;
//
//    public WeatherFragment() {
//        // Required empty public constructor
//    }
//
//    /**
//     * Use this factory method to create a new instance of
//     * this fragment using the provided parameters.
//     *
//     * @param param1 Parameter 1.
//     * @param param2 Parameter 2.
//     * @return A new instance of fragment WeatherFragment.
//     */
//    // TODO: Rename and change types and number of parameters
//    public static WeatherFragment newInstance(String param1, String param2) {
//        WeatherFragment fragment = new WeatherFragment();
//        Bundle args = new Bundle();
//        args.putString(ARG_PARAM1, param1);
//        args.putString(ARG_PARAM2, param2);
//        fragment.setArguments(args);
//        return fragment;
//    }
//
//    @Override
//    public void onCreate(Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//        if (getArguments() != null) {
//            mParam1 = getArguments().getString(ARG_PARAM1);
//            mParam2 = getArguments().getString(ARG_PARAM2);
//        }
//
//    }
//
//
//
//
//    @Override
//    public View onCreateView(LayoutInflater inflater, ViewGroup container,
//                             Bundle savedInstanceState) {
////        View view = inflater.inflate(R.layout.weather_fragment, container, false);
////        Bundle args = getArguments();
////        if(args!=null) {
////            CardView card = (CardView) view.findViewById(R.id.card_view);
////            RelativeLayout imageView = (RelativeLayout) view.findViewById(R.id.weatherImage);
////            switch(args.getString("type")){
////                case "Clouds":imageView.setBackgroundResource(R.drawable.cloudy_weather);
////                               break;
////                case "Clear" :imageView.setBackgroundResource(R.drawable.clear_weather);
////                               break;
////                case "Snow" : imageView.setBackgroundResource(R.drawable.snowy_weather);
////                               break;
////                case "Rain" : imageView.setBackgroundResource(R.drawable.rainy_weather);
////                               break;
////                case "Drizzle" : imageView.setBackgroundResource(R.drawable.rainy_weather);
////                                break;
////                case "Thunderstorm" : imageView.setBackgroundResource(R.drawable.rainy_weather);
////                                 break;
////                default:imageView.setBackgroundResource(R.drawable.sunny_weather);
////                              break;
////            }
////
////            TextView weatherCity = (TextView) view.findViewById(R.id.weatherCity);
////            TextView weatherState = (TextView) view.findViewById(R.id.weatherState);
////            TextView weatherTemp = (TextView) view.findViewById(R.id.weatherTemp);
////            TextView weatherType = (TextView) view.findViewById(R.id.weatherType);
////            weatherCity.setText(args.getString("city"));
////            weatherState.setText(args.getString("state"));
////            weatherTemp.setText(args.getString("temp") + " \u2103");
////            weatherType.setText(args.getString("type"));
//        }
//        return view;
//    }
//
//
//}
