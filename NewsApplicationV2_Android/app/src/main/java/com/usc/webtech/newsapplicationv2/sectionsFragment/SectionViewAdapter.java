package com.usc.webtech.newsapplicationv2.sectionsFragment;

import android.os.Bundle;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;
import androidx.fragment.app.FragmentStatePagerAdapter;

import java.util.List;

public class  SectionViewAdapter extends FragmentPagerAdapter {

    private int numofTabs;

    public SectionViewAdapter(@NonNull FragmentManager fm) {
        super(fm);
        this.numofTabs = 6;
    }

    @NonNull
    @Override
    public Fragment getItem(int position) {
        SectionFragment sectionFragment = new SectionFragment();
        Bundle args = new Bundle();
        if(position == 0) {
            Log.i("World clicked","Position 0");
            args.putString("sectionType", "World");
        }else if(position == 1){
            args.putString("sectionType", "Business");
        }else if(position == 2){
            args.putString("sectionType", "Politics");
        }else if(position == 3 ){
            args.putString("sectionType", "Sports");
        }else if(position == 4 ){
            args.putString("sectionType", "Technology");
        }else if(position == 5 ){
            args.putString("sectionType", "Science");
        }
        sectionFragment.setArguments(args);
        return sectionFragment;
//        if (position == 0) {
//            return new WorldFragment();
//        } else if (position == 1) {
//            Log.i("Position clicked ", "Position 1 ");
//            return new BusinessFragment();
//        } else if (position == 2) {
//            Log.i("Default clicked ", "Position 2 ");
//            return new PoliticsFragment();
//        } else if (position == 3) {
//            Log.i("Default clicked ", "Position 2 ");
//            return new SportsFragment();
//        } else if (position == 4) {
//            Log.i("Default clicked ", "Position 2 ");
//            return new Technology();
//        } else{
//            Log.i("Default clicked ", "Position 2 ");
//            return new Science();
//        }
      }

    @Override
    public int getCount() {
        return 6;
    }

    @Override
    public int getItemPosition(@NonNull Object object) {
        return POSITION_NONE;
    }
}
