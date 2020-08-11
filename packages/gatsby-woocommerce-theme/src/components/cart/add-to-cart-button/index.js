import React, { useState, useContext } from "react";
import { useQuery, useMutation } from '@apollo/client';
import { AppContext } from "../../context/AppContext";
import { addFirstProduct, getFormattedCart, updateCart } from "../../../utils/functions";
import  Link from 'gatsby-link';
import { v4 } from 'uuid';
import GET_CART from "../../../queries/get-cart";
import ADD_TO_CART from "../../../mutations/add-to-cart";

const AddToCart = ( props ) => {

	const { product } = props;

	const productQryInput = {
		clientMutationId: v4(), // Generate a unique id.
		productId: product.productId,
	};

	const [ cart, setCart ] = useContext( AppContext );
	const [ showViewCart, setShowViewCart ] = useState( false );
	const [ requestError, setRequestError ] = useState( null );


	// Get Cart Data.
	const { loading, error, data, refetch } = useQuery( GET_CART, {
		      notifyOnNetworkStatusChange: true,
		      onCompleted: () => {
			      // console.warn( 'completed GET_CART' );

			      // Update cart in the localStorage.
			      const updatedCart = getFormattedCart( data );
			      localStorage.setItem( 'woo-next-cart', JSON.stringify( updatedCart ) );

			      // Update cart data in React Context.
			      setCart( updatedCart );
		      }
	      } );

	// Add to Cart Mutation.
	const [ addToCart, { data: addToCartRes, loading: addToCartLoading, error: addToCartError }] = useMutation( ADD_TO_CART, {
		variables: {
			input: productQryInput,
		},
		onCompleted: () => {
			// console.warn( 'completed ADD_TO_CART' );

			// If error.
			if ( addToCartError ) {
				setRequestError( addToCartError.graphQLErrors[ 0 ].message );
			}

			// On Success:
			// 1. Make the GET_CART query to update the cart with new values in React context.
			refetch();

			// 2. Show View Cart Button
			setShowViewCart( true )
		},
		onError: ( error ) => {
			if ( error ) {
				setRequestError( error.graphQLErrors[ 0 ].message );
			}
		}
	} );

	const handleAddToCartClick = () => {
		setRequestError( null );
		addToCart();
	};

	return (
		<div>
			{/* Add To Cart Loading*/}
			{addToCartLoading && <p>Adding to Cart...</p>}

			{/*	Check if its an external product then put its external buy link */}
			{ "ExternalProduct" === product.__typename ? (
					<a href={ product.externalUrl } target="_blank" className="btn btn-secondary">Buy</a>
				) :
				<button onClick={ handleAddToCartClick } className="btn btn-secondary">Add to cart</button>
			}
			{ showViewCart ? (
				<Link to="/cart"><button className="woo-next-view-cart-btn btn btn-secondary">View Cart</button></Link>
			) : '' }
		</div>
	);
};

export default AddToCart;
