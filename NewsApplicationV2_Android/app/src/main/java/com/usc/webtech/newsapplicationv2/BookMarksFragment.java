package com.usc.webtech.newsapplicationv2;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;

import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import com.google.gson.stream.JsonReader;

import org.w3c.dom.Text;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


/**
 * A simple {@link Fragment} subclass.
 * Use the {@link BookMarksFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class BookMarksFragment extends Fragment {
    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;
    List<TopNewsCard> bookMarks = new ArrayList<TopNewsCard>();
    private RecyclerView bookMarkView;
    private BookMarkCardsAdapter bookMarkAdapter;
    private TextView noBookmarkText;

    public BookMarksFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment BookMarks.
     */
    // TODO: Rename and change types and number of parameters
    public static BookMarksFragment newInstance(String param1, String param2) {
        BookMarksFragment fragment = new BookMarksFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        createListFromCache();
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    private void createListFromCache() {
        SharedPreferences cache = getActivity().getSharedPreferences("bookmarks", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = cache.edit();
        Map<String, ?> allEntries = cache.getAll();
        Gson gson = new Gson();
        try {
        for (Map.Entry<String, ?> entry : allEntries.entrySet()) {
                    TopNewsCard bookMark = gson.fromJson(new JsonParser().parse((String)entry.getValue()), TopNewsCard.class);
                    bookMarks.add(bookMark);
                }
            }catch (Exception ex){
                Log.e("Parse GSON::","BookMark Data parsing error");
            }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View layout = inflater.inflate(R.layout.fragment_book_marks, container, false);

        bookMarkView = (RecyclerView) layout.findViewById(R.id.bookmark_list);
        noBookmarkText = (TextView) layout.findViewById(R.id.no_bookmark_msg);
        if(bookMarks.size()==0){
            noBookmarkText.setVisibility(View.VISIBLE);
        }
        bookMarkAdapter = new BookMarkCardsAdapter(getActivity(), bookMarks,noBookmarkText);
        bookMarkView.setAdapter(bookMarkAdapter);
        bookMarkView.addItemDecoration(new DividerItemDecoration(getActivity(), DividerItemDecoration.VERTICAL));
        bookMarkView.setLayoutManager(new GridLayoutManager(getActivity(),2));
        return layout;
    }


    @Override
    public void onResume() {
        super.onResume();
        if(bookMarkAdapter!=null){
            bookMarks.clear();
            createListFromCache();
            if(bookMarks.size()==0){
                noBookmarkText.setVisibility(View.VISIBLE);
            }
            bookMarkView.setAdapter(bookMarkAdapter);
            bookMarkAdapter.notifyDataSetChanged();
        }
    }
}
