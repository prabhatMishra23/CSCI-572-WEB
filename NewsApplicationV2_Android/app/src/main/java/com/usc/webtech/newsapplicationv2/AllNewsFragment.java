package com.usc.webtech.newsapplicationv2;

import android.os.Bundle;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentPagerAdapter;
import androidx.viewpager.widget.PagerAdapter;
import androidx.viewpager.widget.ViewPager;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.google.android.material.tabs.TabLayout;
import com.usc.webtech.newsapplicationv2.sectionsFragment.SectionViewAdapter;

import java.util.ArrayList;
import java.util.List;


/**
 * A simple {@link Fragment} subclass.
 * Use the {@link AllNewsFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class AllNewsFragment extends Fragment {

    ViewPager viewPager;
    TabLayout tabLayout;
    SectionViewAdapter adapter;

    //List<SectionFragment> fragments = new ArrayList<SectionFragment>();

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    public AllNewsFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment AllNewsFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static AllNewsFragment newInstance(String param1, String param2) {
        AllNewsFragment fragment = new AllNewsFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        adapter = new SectionViewAdapter(getChildFragmentManager());
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment

        View layout = (View) inflater.inflate(R.layout.fragment_all_news, container, false);
        viewPager = (ViewPager) layout.findViewById(R.id.sectionViewPager);
        tabLayout = (TabLayout) layout.findViewById(R.id.tab_layout);
        tabLayout.addOnTabSelectedListener((new TabLayout.OnTabSelectedListener() {
                                                       @Override
                                                       public void onTabSelected(TabLayout.Tab tab) {
                                                           viewPager.setCurrentItem(tab.getPosition());
                                                           if(tab.getPosition() == 0){
                                                               adapter.notifyDataSetChanged();
                                                           }else if(tab.getPosition() == 1){
                                                               adapter.notifyDataSetChanged();
                                                           }else if(tab.getPosition() == 2) {
                                                               adapter.notifyDataSetChanged();
                                                           }else if(tab.getPosition() == 3) {
                                                               adapter.notifyDataSetChanged();
                                                           }else if(tab.getPosition() == 4) {
                                                               adapter.notifyDataSetChanged();
                                                           }else if(tab.getPosition() == 5) {
                                                               adapter.notifyDataSetChanged();
                                                           }
                                                       }

                                                       @Override
                                                       public void onTabUnselected(TabLayout.Tab tab) {

                                                       }

                                                       @Override
                                                       public void onTabReselected(TabLayout.Tab tab) {

                                                       }
                                                   }));
        viewPager.setAdapter(adapter);
        //tabLayout.setupWithViewPager(viewPager);
        viewPager.addOnPageChangeListener(new TabLayout.TabLayoutOnPageChangeListener(tabLayout));
        return layout;
    }

    @Override
    public void onResume() {
        super.onResume();
        if(adapter!=null){
            adapter.notifyDataSetChanged();
        }
    }
}
