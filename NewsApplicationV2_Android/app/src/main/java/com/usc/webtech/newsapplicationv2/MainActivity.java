package com.usc.webtech.newsapplicationv2;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.Manifest;
import android.app.SearchManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationManager;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.RelativeLayout;
import androidx.appcompat.widget.SearchView;
import android.widget.TextView;

import androidx.appcompat.widget.Toolbar;
import androidx.cardview.widget.CardView;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.view.MenuItemCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.material.bottomnavigation.BottomNavigationView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

public class MainActivity extends AppCompatActivity {

    private String city;
    private String state;
    private static final int LOCATION_PERMISSION_ACCESS = 0;

    private static final String API_KEY="b87aa4e111978e35b9c2ea138c5f1a03";

    private static final String GUARDIAN_API_KEY="6696cdf1-3219-4e5c-bb42-75de3e5c6ea6";

    ListView myList;
    SearchView mySearchView;
    SearchView.SearchAutoComplete searchAutoComplete;
    ArrayList<String> suggestedList;
    private int selectedItem;
    ArrayAdapter<String> arrAdapter;
    Context ctx;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        setTheme(R.style.AppTheme);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Toolbar myToolbar = (Toolbar) findViewById(R.id.toolbar);
        myToolbar.setTitle("NewsApp");
        myToolbar.setTitleTextColor(Color.BLACK);
        setSupportActionBar(myToolbar);
        this.city = "Los Angeles";
        this.state = "California";
        ctx = this;
//        SharedPreferences cache = getSharedPreferences("bookmarks",Context.MODE_PRIVATE);
//        SharedPreferences.Editor editor = cache.edit();
//        editor.clear();
//        editor.commit();
        getWeatherData();
        //getTopNewsCardData();

        BottomNavigationView bottomNavigationView = (BottomNavigationView) findViewById(R.id.bottomNav);
        BottomNavigationView.OnNavigationItemSelectedListener listener = new BottomNavigationView.OnNavigationItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                item.setChecked(true);
                selectedItem = item.getItemId();
                switch (item.getItemId()) {
                    case R.id.bottomNavigationHome:
                        Log.i("Home","Clicked");
                        getWeatherData();
                        //getTopNewsCardData();
                        return true;
                    case R.id.bottomNavigationHeadlines:
                        Fragment frag1 = new AllNewsFragment();
                        addFragment(frag1);
                        return true;
                    case R.id.bottomNavigationTrending:
                        Log.i("Trending::","Clicked");
                        Fragment frag2 = new TrendingFragment();
                        addFragment(frag2);
                        return true;
                    case R.id.bottomNavigationBookMark:
                        Fragment frag3 = new BookMarksFragment();
                        addFragment(frag3);
                        return true;
                    default:
                        return true;

                }
            }
        };
        bottomNavigationView.setOnNavigationItemSelectedListener(listener);
        //getWeatherData();
        //getTopNewsCardData();
    }


//    @Override
//    public boolean onCreateOptionsMenu(Menu menu) {
//        MenuInflater inflater = getMenuInflater();
//        inflater.inflate(R.menu.bottom_navigation_layout, menu);
//        return true;
//    }

//    @Override
//    public boolean onNavigationItemSelected(MenuItem item) {
//        // Handle item selection
//        item.setChecked(true);
//
//    }

    private void getWeatherData() {
        getAccessRequest();
        RequestQueue queue = Volley.newRequestQueue(this);
        String url ="https://api.openweathermap.org/data/2.5/weather?q="+this.city+"&units=metric&appid="+API_KEY;

// Request a string response from the provided URL.
        StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try{
                            JSONObject weatherObj = new JSONObject(response);
                            JSONObject weatherDetails = (JSONObject)weatherObj.getJSONArray("weather").get(0);
                            int temp = (int) Math.round(weatherObj.getJSONObject("main").getDouble("temp"));
                            Fragment fragment = new TopNewsFragment();
                            Bundle bundle = new Bundle();
                            bundle.putString("temp",String.valueOf(temp));
                            bundle.putString("city",getCity());
                            bundle.putString("state",getState());
                            bundle.putString("type",(String)weatherDetails.get("main"));
                            fragment.setArguments(bundle);
                            addFragment(fragment);
                            Log.i("WeatheInfo::","Weather details collected");
                        }catch(JSONException ex){
                            Log.e("Weather Error:","Could not parse weather Data");
                        }
                        // Display the first 500 characters of the response string.

                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.e("WeatherAPI Error::","Could not get response from the API");
            }
        });

// Add the request to the RequestQueue.
        queue.add(stringRequest);

    }


    private void addFragment(Fragment frag) {
        FragmentTransaction fragmentTransaction = getSupportFragmentManager().beginTransaction();
        fragmentTransaction.replace(R.id.list, frag);
        fragmentTransaction.commit();
    }

//    private void addCardFragment(Fragment frag) {
//        FragmentTransaction fragmentTransaction = getSupportFragmentManager().beginTransaction();
//        fragmentTransaction.replace(R.id.card_temp_list, frag).addToBackStack(null);
//        fragmentTransaction.commit();
//    }


    private void getAccessRequest() {
        double latitude = 34.021436;
        double longitude = -118.285954;
        if (ContextCompat.checkSelfPermission(this,
                Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED) {

            // Permission is not granted
            // Should we show an explanation?
//            if (ActivityCompat.shouldShowRequestPermissionRationale(this,
//                    Manifest.permission.ACCESS_FINE_LOCATION)) {
//                // Show an explanation to the user *asynchronously* -- don't block
//                // this thread waiting for the user's response! After the user
//                // sees the explanation, try again to request the permission.
//            } else {
                // No explanation needed; request the permission
                Log.i("inside ","request Permission");
                ActivityCompat.requestPermissions(this,
                        new String[]{Manifest.permission.ACCESS_FINE_LOCATION,Manifest.permission.ACCESS_COARSE_LOCATION},
                        LOCATION_PERMISSION_ACCESS);

                // MY_PERMISSIONS_REQUEST_READ_CONTACTS is an
                // app-defined int constant. The callback method gets the
                // result of the request.
           // }
        }
//        else {
            try {
                LocationManager lm = (LocationManager) this.getSystemService(Context.LOCATION_SERVICE);
                Location location = lm.getLastKnownLocation(LocationManager.GPS_PROVIDER);
                longitude = location.getLongitude();
                latitude = location.getLatitude();
                Geocoder geocoder = new Geocoder(this, Locale.getDefault());
                List<Address> addresses = geocoder.getFromLocation(latitude, longitude, 1);
                this.city = addresses.get(0).getLocality();
                this.state = addresses.get(0).getAdminArea();
            } catch (Exception ex) {
                Log.e("error:", "cannot get lat long or location info");
            }
       // }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main_menu_all,menu);
        MenuItem searchItem = menu.findItem(R.id.action_search);
         mySearchView = (SearchView)searchItem.getActionView();

        searchAutoComplete = (SearchView.SearchAutoComplete) mySearchView.findViewById(androidx.appcompat.R.id.search_src_text);
//        searchAutoComplete.setBackgroundColor(Color.BLUE);
//        searchAutoComplete.setTextColor(Color.GREEN);
        //searchAutoComplete.setDropDownBackgroundResource(android.R.color.holo_blue_light);

        searchAutoComplete.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int itemIndex, long id) {
                String queryString=(String)adapterView.getItemAtPosition(itemIndex);
                searchAutoComplete.setText(""+queryString);
                //Toast.makeText(ActionBarSearchActivity.this, "you clicked " + queryString, Toast.LENGTH_LONG).show();
            }
        });

        mySearchView.setOnQueryTextListener(new SearchView.OnQueryTextListener(){

            @Override
            public boolean onQueryTextSubmit(String query) {
                Log.i("Submitted"," "+query);
                Intent intent = new Intent(ctx,SearchableActivity.class);
                intent.putExtra("searchQuery",query);
                ctx.startActivity(intent);
                return false;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                Log.i("Searching"," "+newText);
                if(newText.length()>=2){
                   getDataFromBingApi(newText);
                }
                return false;
            }
        });
        return true;
    }

    private void getDataFromBingApi(String query) {
        final List<String> data = new ArrayList<String>();
        RequestQueue queue = Volley.newRequestQueue(getApplicationContext());
        String AutoSuggest_URL = "https://prabhat-mishra.cognitiveservices.azure.com/bing/v7.0/suggestions?q=" + query;
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.GET, AutoSuggest_URL, null, new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                try {
                    JSONArray suggestionGroups = response.getJSONArray("suggestionGroups");
                    JSONObject first = suggestionGroups.getJSONObject(0);
                    JSONArray searchSuggestions = first.getJSONArray("searchSuggestions");
                    int len = Math.min(5,searchSuggestions.length());
                    for (int i = 0; i < len; i++) {
                        String query = searchSuggestions.getJSONObject(i).getString("query");
                        data.add(query);
                    }
                    searchAutoComplete.setDropDownBackgroundResource(android.R.color.holo_blue_light);
                    ArrayAdapter<String> newsAdapter = new ArrayAdapter<String>(ctx, android.R.layout.simple_dropdown_item_1line, data);
                    searchAutoComplete.setAdapter(newsAdapter);
                    newsAdapter.notifyDataSetChanged();
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d("tag", "onErrorResponse: " + error.getMessage());
            }
        }) {
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                HashMap<String, String> headers = new HashMap<String, String>();
                headers.put("Ocp-Apim-Subscription-Key", "92014f23f3a64269bf3131dddf58fd55");
                return headers;
            }
        };
        queue.add(jsonObjectRequest);

    }

//    @Override
//    protected void onResume() {
//        super.onResume();
//        switch(selectedItem){
//            case R.id.bottomNavigationBookMark:
//                Fragment frag3 = new BookMarksFragment();
//                addFragment(frag3);
//                break;
//            default:
//                return;
//
//        }
//    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }
}
