import {exampleDate} from "@/lib";
import {getBaseOkResponseSchema} from "@/common";
import {GetRentedDatesCarResponse} from "@/types";

export class GetDatesOkRes extends getBaseOkResponseSchema<GetRentedDatesCarResponse>({
  statusCode: 200,
  path: "/cars/id/rent-dates",
  response: {
    message: "Get dates successfully.",
    data: {
      count: 3,
      dates: [
        {
          id: "0190bd17-5100-4ef8-b766-c182be3b27de",
          status: "ACTIVE",
          end_date: exampleDate,
          start_date: exampleDate
        },
        {
          id: "b559233a-f119-44de-983c-1000184c3994",
          status: "ACTIVE",
          end_date: exampleDate,
          start_date: exampleDate
        },
        {
          id: "71d8430c-8476-4184-92e9-72abbc8bb29e",
          status: "ACTIVE",
          end_date: exampleDate,
          start_date: exampleDate
        }
      ]
    }
  }
}) {}
