import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  View,
} from "react-native";
import Swiper from "react-native-swiper";
import styled from "styled-components/native";
import HList from "../components/HList";
import HMedia from "../components/HMedia";
import Loader from "../components/Loader";
import Slide from "../components/Slide";
import VMedia from "../components/VMedia";
import { useInfiniteQuery, useQuery, useQueryClient } from "react-query";
import { MovieResponse, moviesApi } from "../api";

const ListTitle = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin-left: 30px;
`;

const ComingSoonTitle = styled(ListTitle)`
  margin-bottom: 20px;
`;

const HSeparator = styled.View`
  height: 20px;
`;

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Movies: React.FC<NativeStackScreenProps<any, "Movies">> = () => {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const { isLoading: nowPlayingLoading, data: nowPlayingData } = useQuery(
    ["movies", "nowPlaying"],
    moviesApi.nowPlaying
  );

  const {
    isLoading: upcomingLoading,
    data: upcomingData,
    hasNextPage: upcomingHasNext,
    fetchNextPage: upcomingFetchNext,
  } = useInfiniteQuery(["movies", "upcoming"], moviesApi.upcoming, {
    getNextPageParam: (currentPage) => {
      const nextPage = currentPage.page + 1;
      return nextPage > currentPage.total_pages ? null : nextPage;
    },
  });

  const {
    isLoading: trendingLoading,
    data: trendingData,
    hasNextPage: trendingHasNext,
    fetchNextPage: trendingFetchNext,
  } = useQuery(
    ["movies", "trending"],
    moviesApi.trending, {
    getNextPageParam: (currentPage) => {
      const nextPage = currentPage.page + 1;
      return nextPage > currentPage.total_pages ? null : nextPage;
    },
  }
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries(["movies"]);
    setRefreshing(false);
  };

  const loading = nowPlayingLoading || upcomingLoading || trendingLoading;
  const loadMore = () => {
    if (upcomingHasNext) {
      upcomingFetchNext();
    }
  };
  return loading ? (
    <Loader />
  ) : upcomingData ? (
    <FlatList
      onEndReached={loadMore}
      onRefresh={onRefresh}
      refreshing={refreshing}
      ListHeaderComponent={
        <>
          <Swiper
            horizontal
            loop
            autoplay
            autoplayTimeout={3.5}
            showsButtons={false}
            showsPagination={false}
            containerStyle={{
              marginBottom: 40,
              width: "100%",
              height: SCREEN_HEIGHT / 4,
            }}
          >
            {nowPlayingData?.results.map((movie) => (
              <Slide
                key={movie.id}
                backdropPath={movie.backdrop_path || ""}
                posterPath={movie.poster_path || ""}
                originalTitle={movie.original_title}
                voteAverage={movie.vote_average}
                overview={movie.overview}
                fullData={movie}
              />
            ))}
          </Swiper>
          {trendingData ? (
            <HList title="Trending Movies" data={trendingData.results} />
          ) : null}
          <ComingSoonTitle>Coming soon</ComingSoonTitle>
        </>
      }
      data={upcomingData.pages.map((page) => page.results).flat()}
      keyExtractor={(item) => item.id + ""}
      ItemSeparatorComponent={HSeparator}
      renderItem={({ item }) => (
        <HMedia
          posterPath={item.poster_path || ""}
          originalTitle={item.original_title}
          overview={item.overview}
          releaseDate={item.release_date}
          fullData={item}
        />
      )}
    />
  ) : null;
};
export default Movies;