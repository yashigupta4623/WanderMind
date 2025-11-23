import { describe, it, expect, vi } from "vitest";
import { GetPlaceDetails, PHOTO_REF_URL } from "./GlobalApi";
import axios from "axios";

// Mock axios
vi.mock("axios");

describe("GlobalApi", () => {
    it("GetPlaceDetails makes a POST request with correct parameters", async () => {
        const mockData = { textQuery: "Paris" };
        const mockResponse = { data: { places: [] } };
        axios.post.mockResolvedValue(mockResponse);

        await GetPlaceDetails(mockData);

        expect(axios.post).toHaveBeenCalledWith(
            "https://places.googleapis.com/v1/places:searchText",
            mockData,
            expect.objectContaining({
                headers: expect.objectContaining({
                    "Content-Type": "application/json",
                    "X-Goog-FieldMask": ["places.photos", "places.displayName", "places.id"],
                }),
            })
        );
    });

    it("PHOTO_REF_URL contains the API key", () => {
        expect(PHOTO_REF_URL).toContain("key=");
    });
});
