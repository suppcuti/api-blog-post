import { gql } from "@apollo/client";

export const GET_BLOG_POSTS = gql`
  query blogPosts(
    $filter: BlogPostsFilterInput
    $pageSize: Int
    $currentPage: Int
    $sortFiled: String
    $allPosts: Boolean
  ) {
    blogPosts(
      filter: $filter
      pageSize: $pageSize
      currentPage: $currentPage
      sortFiled: $sortFiled
      allPosts: $allPosts
    ) {
      items {
        title
        featured_image
        content_heading
        publish_time
        meta_description  
        
        author {
          name
          content   
          meta_description  
        }
        post_url
      }
    }
  }
`;
