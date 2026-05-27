import {exampleDate} from "@/lib";
import {getBaseOkResponseSchema} from "@/common";
import {confirmedCommentExample} from "./confirm.dto";
import type {CommentNUserNCar, CommentNUserNCarList} from "@/types";

export const unconfirmedComment: CommentNUserNCar = {
  ...confirmedCommentExample,
  is_confirmed: false,
  user: {
    id: "7e1d66d6-0823-43af-8a6e-737b6923778c",
    created_at: exampleDate,
    updated_at: exampleDate,
    display_name: "user",
    age: 25,
    email: "user@example.com"
  },
  car: {
    id: "9e4f7159-ab7f-4ac8-96d8-52be77108105",
    created_at: exampleDate,
    updated_at: exampleDate,
    name: "test-car",
    slug: "test-car",
    company: "test",
    price_per_day: 5000000,
    image: "uploads/car/9e4f7159-ab7f-4ac8-96d8-52be77108105.jpg",
    tags: [
      "lux",
      "test-car"
    ],
    description: "string of test-car",
    rate: 5,
    in_rent: false,
    can_rent: true,
    category_id: "895f4c9a-85c8-455e-8251-96ca7afae987",
    creator_id: null
  },
};

export class FindAllUnconfirmedOk extends getBaseOkResponseSchema<CommentNUserNCarList>({
  path: 'comments/unconfirmed',
  response: {
    message: '',
    data: {
      count: 5,
      comments: Array.from({length: 5}, () => unconfirmedComment)
    }
  }
}) {}