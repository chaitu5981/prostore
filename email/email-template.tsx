import { currencyFormatter, formatDate } from "@/lib/utils";
import { Order } from "@/types";
import {
  Column,
  Container,
  Heading,
  Html,
  Img,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

const EmailTemplate = ({ order }: { order: Order }) => {
  return (
    <Html>
      <Tailwind>
        <Container>
          <Section>
            <Heading>Purchase Receipt</Heading>
            <Row>
              <Column>
                <Text>Order ID</Text>
                <Text>{order.id}</Text>
              </Column>
              <Column>
                <Text>Purchase Date</Text>
                <Text>{formatDate(order.createdAt)}</Text>
              </Column>
              <Column>
                <Text>Amount Paid</Text>
                <Text>{currencyFormatter(order.totalPrice)}</Text>
              </Column>
            </Row>
          </Section>
          <Section className="border-2 border-black rounded-md">
            {order.orderItems.map((orderItem) => (
              <Row key={orderItem.productId}>
                <Column className="flex gap-5 items-center">
                  <Img
                    src={orderItem.image}
                    alt="Product Image"
                    className="w-15 h-15"
                  />
                  <Text>
                    {orderItem.productName} x {orderItem.qty}
                  </Text>
                </Column>
                <Column>{currencyFormatter(orderItem.price)}</Column>
              </Row>
            ))}
          </Section>
        </Container>
      </Tailwind>
    </Html>
  );
};
export default EmailTemplate;
