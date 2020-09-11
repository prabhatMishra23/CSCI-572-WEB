package com.usc.webtech.newsapplicationv2;

import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.GridLayout;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.google.gson.Gson;

import org.w3c.dom.Text;

import java.util.ArrayList;
import java.util.List;

public class TopNewsAdapter extends RecyclerView.Adapter<TopcardViewHoder> {
    private LayoutInflater cardInflator;
    private Context context;
    List<TopNewsCard> cards = new ArrayList<TopNewsCard>();

    public TopNewsAdapter(Context ctx,List<TopNewsCard> cards){
        this.cards = cards;
        this.context = ctx;
        cardInflator = LayoutInflater.from(ctx);
    }
    @Override
    public TopcardViewHoder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = cardInflator.inflate(R.layout.top_news_card,parent,false);
        TopcardViewHoder holder = new TopcardViewHoder(view);
        return holder;
    }

    @Override
    public void onBindViewHolder(@NonNull final TopcardViewHoder holder, int position) {
        final TopNewsCard card = cards.get(position);
        holder.title .setText(card.getTitle());
        Glide.with(context).load(card.getImageUrl()).into(holder.image);
        holder.newStatus.setText(card.getNewsStatus());
        holder.newsType.setText(card.getNewsType());
        SharedPreferences cache = context.getSharedPreferences("bookmarks",Context.MODE_PRIVATE);
//        if(cache.getString(card.getArticleId(),"").equals("true")){
        if(cache.contains(card.getArticleId())){
            holder.bookMarkIcon.setImageResource(R.drawable.baseline_bookmark_24);
        }else{
            holder.bookMarkIcon.setImageResource(R.drawable.baseline_bookmark_border_24);
        }
        holder.cardView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(context,DetailedCardActivity.class);
                intent.putExtra("articleId",card.getArticleId());
                context.startActivity(intent);
            }
        });

        holder.cardView.setOnLongClickListener(new View.OnLongClickListener(){

            @Override
            public boolean onLongClick(View v) {
                openDialog(v,card);
                return true;
            }
        });

        holder.bookMarkIcon.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                SharedPreferences cache = context.getSharedPreferences("bookmarks",Context.MODE_PRIVATE);
                if(!cache.contains(card.getArticleId())){
                    ((ImageView)v).setImageResource(R.drawable.baseline_bookmark_24);
                    addToCache(card);
                }else{
                    ((ImageView)v).setImageResource(R.drawable.baseline_bookmark_border_24);
                    removeFromCache(card);
                }
            }
        });
    }

    private void openDialog(View v, final TopNewsCard card) {
        final View parentView = v;
        Dialog dialog = new Dialog(context);
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
                SharedPreferences cache = context.getSharedPreferences("bookmarks",Context.MODE_PRIVATE);
                if(!cache.contains(card.getArticleId())){
                    ((ImageView)v).setImageResource(R.drawable.baseline_bookmark_24);
                    notifyDataSetChanged();
                   // ((ImageView)parentView).setImageResource(R.drawable.baseline_bookmark_24);
                    //((ImageView)parentView.findViewById(R.id.top_news_bookmark)).setImageResource(R.drawable.baseline_bookmark_24);
                    addToCache(card);
                }else{
                    ((ImageView)v).setImageResource(R.drawable.baseline_bookmark_border_24);
                    notifyDataSetChanged();
                   // ((ImageView)parentView.findViewById(R.id.top_news_bookmark)).setImageResource(R.drawable.baseline_bookmark_border_24);
                    removeFromCache(card);
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
       // editor.remove(card.getArticleId()+"fullCard");
        Toast.makeText(context,card.getTitle()+ " was removed from bookmarks",Toast.LENGTH_LONG).show();
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
        return cards.size();
    }

    private void callTwitterWebIntent(String url) {
        String shareText = "Checkout this link "+url+" #CSCI571NewsSearch";
        String tweetUrl = "https://twitter.com/intent/tweet?text="+ Uri.encode(shareText);
        Uri generateduri = Uri.parse(tweetUrl);
        Intent shareIntent = new Intent(Intent.ACTION_VIEW, generateduri);
        context.startActivity(shareIntent);
    }
}



class TopcardViewHoder extends RecyclerView.ViewHolder {
  TextView title ;
  ImageView image;
  TextView newStatus;
  TextView newsType;
  CardView cardView;
  ImageView bookMarkIcon;
  //GridLayout from;
    public TopcardViewHoder(@NonNull View itemView) {
        super(itemView);
        title = itemView.findViewById(R.id.top_card_title);
        image = itemView.findViewById(R.id.topNewsImg);
        newStatus = itemView.findViewById(R.id.top_card_timeStamp);
        newsType = itemView.findViewById(R.id.top_card_newsType);
        cardView = itemView.findViewById(R.id.top_card_view);
        bookMarkIcon = itemView.findViewById(R.id.top_news_bookmark);
       // from = itemView.findViewById(R.id.cardPrabhat)
    }

}

