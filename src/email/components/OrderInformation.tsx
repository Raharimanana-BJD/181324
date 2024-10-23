import React from "react";
import { formatCurrency } from "@/lib/formatters";
import {
  Button,
  Column,
  Img,
  Row,
  Section,
  Text,
} from "@react-email/components";

type OrderInformationProps = {
  order: { id: string; createdAt: Date; pricePaidInCents: number };
  product: { imagePath: string; name: string; description: string };
  downloadVerificationId: string;
};

const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

export function OrderInformation({
  order,
  product,
  downloadVerificationId,
}: OrderInformationProps) {
  const imageUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}${product.imagePath}`;
  console.log("Image URL:", imageUrl);
  return (
    <>
      <Section>
        <Row>
          <Column>
            <Text className="mb-2 text-gray-500">Order ID</Text>
            <Text className="mb-4">{order.id}</Text>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text className="mb-2 text-gray-500">Purchased On</Text>
            <Text className="mb-4">
              {dateFormatter.format(order.createdAt)}
            </Text>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text className="mb-2 text-gray-500">Price Paid</Text>
            <Text className="mb-4">
              {formatCurrency(order.pricePaidInCents / 100)}
            </Text>
          </Column>
        </Row>
      </Section>
      <Section className="border border-solid border-gray-500 rounded-lg p-4 my-4">
        <Img
          width="100%"
          alt={product.name}
          src={`${process.env.NEXT_PUBLIC_SERVER_URL}${product.imagePath}`}
        />
        <Row className="mt-4">
          <Column>
            <Text className="text-lg font-bold mb-2">{product.name}</Text>
            <Text className="text-gray-500 mb-4">{product.description}</Text>
          </Column>
        </Row>
        <Row>
          <Column align="center">
            <Button
              href={`${process.env.NEXT_PUBLIC_SERVER_URL}/products/download/${downloadVerificationId}`}
              className="bg-black text-white px-6 py-3 rounded text-base"
            >
              Download
            </Button>
          </Column>
        </Row>
      </Section>
    </>
  );
}
