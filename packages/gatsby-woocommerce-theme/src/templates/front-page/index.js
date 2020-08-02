import React from "react";
import Search from "../../components/home/search";
import { isEmpty } from 'lodash';
import Layout from "../../components/layout";

const FrontPage = ( props ) => {

	const {
		      pageContext: {
			      categories,
			      postSearchData: { products, options }
		      }
	      } = props;

	return (
		<Layout>
			{
				! isEmpty( props.pageContext ) ? (
					<>
						<Search
							products={ products }
							engine={ options }
							categories={ categories }
						/>
					</>
				) : (
					<div>Something went wrong</div>
				)
			}
		</Layout>
	)
};
export default FrontPage;

