import { Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Product from '../components/Product';
import Paginate from '../components/Paginate';
import { useGetProductsQuery } from '../slices/productsApiSlice';

const HomeScreen = () => {
    const { pageNum } = useParams();
    console.log(`PAGE NUM: `, pageNum);
    const { data, isLoading, error } = useGetProductsQuery({ pageNum });

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error?.data?.message || error.error}</Message>
            ) : (<>
                <h1>Latest Products</h1 >
                <Row>
                    {data.products.map((product) => (
                        <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                            <Product product={product} />
                        </Col>
                    ))}
                </Row>
                <Paginate pages={data.pages} currPage={pageNum} />
            </>
            )}

        </>
    );
};

export default HomeScreen;