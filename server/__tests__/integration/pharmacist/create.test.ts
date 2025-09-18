import request from "supertest";
import app from "../../..";
import * as PharmacistData from "./../../fixtures/pharmacist";
import { CREATE_PHARMACIST_URL } from "./config";

describe("Create Pharmacist API", () => {
    it("should create pharmacist", async () => {
        const resopnse = await request(app).post(CREATE_PHARMACIST_URL).send(PharmacistData.CompleteData).set("Accept", "application/json");
    });
});
