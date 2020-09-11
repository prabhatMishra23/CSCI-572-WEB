package com.usc.webtech.newsapplicationv2;

import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.google.gson.Gson;

import java.util.List;

public class BookMarkCardsAdapter extends RecyclerView.Adapter<BookMarkViewHolder> {
    private LayoutInflater bookMarkInflator;
    private Context context;
    private List<TopNewsCard> bookMarkList;
    private TextView bookMarkView;

    public BookMarkCardsAdapter(Context ctx, List<TopNewsCard> bookmarks, TextView noBookmarkText){
        this.context = ctx;
        this.bookMarkList = bookmarks;
        bookMarkInflator = LayoutInflater.from(ctx);
        this.bookMarkView = noBookmarkText;
    }



    @NonNull
    @Override
    public BookMarkViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = bookMarkInflator.inflate(R.layout.bookmarks_tab_card,parent,false);
        return new BookMarkViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull final BookMarkViewHolder holder, final int position) {
      final TopNewsCard bookMark = bookMarkList.get(position);
      Glide.with(context).load(bookMark.getImageUrl()).into(holder.bookmarkImg);
      holder.bookmarkTitle.setText(bookMark.getTitle());
      holder.bookmarkDate.setText(bookMark.getWebPubDate());
      holder.bookmarkSection.setText(bookMark.getNewsType().substring(0,Math.min(bookMark.getNewsType().length(),13)));
        SharedPreferences cache = context.getSharedPreferences("bookmarks",Context.MODE_PRIVATE);
//        if(cache.getString(card.getArticleId(),"").equals("true")){
        if(cache.contains(bookMark.getArticleId())){
            holder.bookMarkIcon.setImageResource(R.drawable.baseline_bookmark_24);
        }else{
            holder.bookMarkIcon.setImageResource(R.drawable.baseline_bookmark_border_24);
        }
        holder.bookMarkIcon.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                SharedPreferences cache = context.getSharedPreferences("bookmarks",Context.MODE_PRIVATE);
                if(!cache.contains(bookMark.getArticleId())){
                    ((ImageView)v).setImageResource(R.drawable.baseline_bookmark_24);
                    addToCache(bookMark);
                }else{
                    ((ImageView)v).setImageResource(R.drawable.baseline_bookmark_border_24);
                    //holder.bookmarkCardView.setVisibility(View.GONE);
                    bookMarkList.remove(position);
                    notifyItemRemoved(position);
                    notifyItemRangeChanged(position, bookMarkList.size());
                    removeFromCache(bookMark);
                }
                //Toast.makeText(getA,"Saving "+card.getTitle()).show();
            }
        });

        holder.bookmarkCardView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(context,DetailedCardActivity.class);
                intent.putExtra("articleId",bookMark.getArticleId());
                context.startActivity(intent);
            }
        });

        holder.bookmarkCardView.setOnLongClickListener(new View.OnLongClickListener(){

            @Override
            public boolean onLongClick(View v) {
                openDialog(v,bookMark,position);
                return true;
            }
        });

    }

    private void openDialog(View v, final TopNewsCard card, final int position) {
        final View parentView = v;
        final Dialog dialog = new Dialog(context);
        dialog.setContentView(R.layout.layout_card_dialog);
        ImageView img = (ImageView) dialog.findViewById(R.id.dialog_image);
        Glide.with(context).load(card.getImageUrl()).into(img);
        TextView dialogTitle = dialog.findViewById(R.id.dialog_title);
        dialogTitle.setText(card.getTitle());
        final ImageView bookmark = dialog.findViewById(R.id.dialog_bookmark);
        final ImageView twitter = dialog.findViewById(R.id.dialog_twitter_share);
        SharedPreferences cache = context.getSharedPreferences("bookmarks",Context.MODE_PRIVATE);
        //if(cache.getString(card.getArticleId(),"").equals("true")){
        if(cache.contains(card.getArticleId())){
            bookmark.setImageResource(R.drawable.baseline_bookmark_24);
        }
        bookmark.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                TopNewsCard localCard;
                SharedPreferences cache = context.getSharedPreferences("bookmarks",Context.MODE_PRIVATE);
                if(!cache.contains(card.getArticleId())){
                    ((ImageView)v).setImageResource(R.drawable.baseline_bookmark_24);
                    // ((ImageView)parentView).setImageResource(R.drawable.baseline_bookmark_24);
                    //((ImageView)parentView.findViewById(R.id.bookmark_icon)).setImageResource(R.drawable.baseline_bookmark_24);
                    //notifyItemRemoved(position);
                    addToCache(card);
                }else{
                    ((ImageView)v).setImageResource(R.drawable.baseline_bookmark_border_24);
                    //((ImageView)parentView.findViewById(R.id.bookmark_icon)).setImageResource(R.drawable.baseline_bookmark_border_24);
                    //parentView.setVisibility(View.GONE);
                    bookMarkList.remove(position);
                    notifyItemRemoved(position);
                    notifyItemRangeChanged(position, bookMarkList.size());
                    removeFromCache(card);
                    notifyDataSetChanged();
                    dialog.dismiss();
                }
            }
        });

        twitter.setOnClickListener(new View.OnClickListener(){

            @Override
            public void onClick(View v) {
                callTwitterWebIntent(card.getArticleUrl());
            }
        });

        dialog.show();
    }
    private void removeFromCache(TopNewsCard card) {
        SharedPreferences cache = context.getSharedPreferences("bookmarks",Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = cache.edit();
        editor.remove(card.getArticleId());
        if(bookMarkList.size()==0){
            bookMarkView.setVisibility(View.VISIBLE);
        }
        // editor.remove(card.getArticleId()+"fullCard");
        Toast.makeText(context,card.getTitle()+" was removed from bookmarks",Toast.LENGTH_LONG).show();
        editor.commit();
    }

    private void addToCache(TopNewsCard card) {
        SharedPreferences cache = context.getSharedPreferences("bookmarks",Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = cache.edit();
        // editor.putString(card.getArticleId(),"true");
        Gson gson = new Gson();
        String json = gson.toJson(card);
        editor.putString(card.getArticleId(),json);
        Toast.makeText(context,card.getTitle()+" was added to bookmarks",Toast.LENGTH_LONG).show();
        editor.commit();
    }

    @Override
    public int getItemCount() {
        return bookMarkList.size();
    }

    private void callTwitterWebIntent(String url) {
        String shareText = "Checkout this link "+url+" #CSCI571NewsSearch";
        String tweetUrl = "https://twitter.com/intent/tweet?text="+ Uri.encode(shareText);
        Uri generateduri = Uri.parse(tweetUrl);
        Intent shareIntent = new Intent(Intent.ACTION_VIEW, generateduri);
        context.startActivity(shareIntent);
    }


}

class BookMarkViewHolder extends RecyclerView.ViewHolder{
    ImageView bookmarkImg;
    TextView bookmarkTitle;
    TextView bookmarkSection;
    TextView bookmarkDate;
    ImageView bookMarkIcon;
    CardView bookmarkCardView;

    public BookMarkViewHolder(@NonNull View itemView) {
        super(itemView);
        this.bookmarkImg = itemView.findViewById(R.id.bookmark_card_img);
        this.bookmarkTitle = itemView.findViewById(R.id.bookmark_card_title);
        this.bookmarkSection = itemView.findViewById(R.id.bookmark_section);
        this.bookmarkDate = itemView.findViewById(R.id.bookmark_date);
        this.bookMarkIcon = itemView.findViewById(R.id.bookmark_icon);
        this.bookmarkCardView = itemView.findViewById(R.id.bookmarkCardView);
    }
}
