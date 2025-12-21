import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/db";
import { campingSites, addresses } from "$lib/db/schemas";
import { eq, and, or, desc, ilike, gte, lte, sql } from "drizzle-orm";
import { requireAuth } from "$lib/auth/middleware";
import { addToModerationQueue } from "$lib/moderation";

export const GET: RequestHandler = async ({ url, locals }) => {
  const status = url.searchParams.get("status");
  const featured = url.searchParams.get("featured");
  const limit = parseInt(url.searchParams.get("limit") || "50");
  const offset = parseInt(url.searchParams.get("offset") || "0");

  // New filter parameters
  const search = url.searchParams.get("search");
  const siteType = url.searchParams.get("siteType");
  const petPolicy = url.searchParams.get("petPolicy");
  const firePolicy = url.searchParams.get("firePolicy");
  const minCost = url.searchParams.get("minCost");
  const maxCost = url.searchParams.get("maxCost");
  const amenitiesParam = url.searchParams.get("amenities");
  const facilitiesParam = url.searchParams.get("facilities");
  const reservationRequired = url.searchParams.get("reservationRequired");

  const conditions = [];

  if (status) {
    conditions.push(
      eq(campingSites.status, status as "pending" | "approved" | "rejected"),
    );
  } else {
    // By default, only show approved camping sites to non-admins
    if (!locals.userId) {
      conditions.push(eq(campingSites.status, "approved"));
    }
  }

  if (featured === "true") {
    conditions.push(eq(campingSites.featured, true));
    // Featured items must also be approved
    conditions.push(eq(campingSites.status, "approved"));
  }

  // Filter by site type
  if (siteType) {
    conditions.push(eq(campingSites.siteType, siteType as any));
  }

  // Filter by pet policy
  if (petPolicy) {
    conditions.push(eq(campingSites.petPolicy, petPolicy as any));
  }

  // Filter by fire policy
  if (firePolicy) {
    conditions.push(eq(campingSites.firePolicy, firePolicy as any));
  }

  // Filter by cost range
  if (minCost) {
    conditions.push(gte(campingSites.costPerNight, minCost));
  }
  if (maxCost) {
    conditions.push(lte(campingSites.costPerNight, maxCost));
  }

  // Filter by reservation required
  if (reservationRequired === "true") {
    conditions.push(eq(campingSites.reservationRequired, true));
  }

  // Filter by amenities (JSONB array contains)
  if (amenitiesParam) {
    const amenityIds = amenitiesParam.split(",").filter(Boolean);
    if (amenityIds.length > 0) {
      conditions.push(
        sql`${campingSites.amenities} @> ${JSON.stringify(amenityIds)}::jsonb`,
      );
    }
  }

  // Filter by facilities (JSONB array contains)
  if (facilitiesParam) {
    const facilityIds = facilitiesParam.split(",").filter(Boolean);
    if (facilityIds.length > 0) {
      conditions.push(
        sql`${campingSites.facilities} @> ${JSON.stringify(facilityIds)}::jsonb`,
      );
    }
  }

  // Build query with optional address join for search
  let query;
  if (search) {
    // Join with addresses for location search
    query = db
      .select({
        id: campingSites.id,
        name: campingSites.name,
        description: campingSites.description,
        addressId: campingSites.addressId,
        capacity: campingSites.capacity,
        amenities: campingSites.amenities,
        facilities: campingSites.facilities,
        reservationInfo: campingSites.reservationInfo,
        costPerNight: campingSites.costPerNight,
        baseFee: campingSites.baseFee,
        operatingSeasonStart: campingSites.operatingSeasonStart,
        operatingSeasonEnd: campingSites.operatingSeasonEnd,
        petPolicy: campingSites.petPolicy,
        reservationRequired: campingSites.reservationRequired,
        siteType: campingSites.siteType,
        firePolicy: campingSites.firePolicy,
        status: campingSites.status,
        featured: campingSites.featured,
        createdBy: campingSites.createdBy,
        createdAt: campingSites.createdAt,
        updatedAt: campingSites.updatedAt,
      })
      .from(campingSites)
      .leftJoin(addresses, eq(campingSites.addressId, addresses.id))
      .where(
        and(
          ...conditions,
          or(
            ilike(campingSites.name, `%${search}%`),
            ilike(campingSites.description, `%${search}%`),
            ilike(addresses.city, `%${search}%`),
            ilike(addresses.state, `%${search}%`),
          ),
        ),
      )
      .limit(limit)
      .offset(offset)
      .orderBy(desc(campingSites.createdAt));

    const results = await query;
    return json(results);
  } else {
    const results = await db.query.campingSites.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      limit,
      offset,
      orderBy: [desc(campingSites.createdAt)],
    });

    return json(results);
  }
};

export const POST: RequestHandler = async ({ request, locals }) => {
  const user = requireAuth({ locals } as any);

  const body = await request.json();
  const {
    name,
    description,
    addressId,
    capacity,
    amenities,
    facilities,
    reservationInfo,
    costPerNight,
    baseFee,
    operatingSeasonStart,
    operatingSeasonEnd,
    petPolicy,
    reservationRequired,
    siteType,
    firePolicy,
  } = body;

  if (!name) {
    throw error(400, "Name is required");
  }

  const [newCampingSite] = await db
    .insert(campingSites)
    .values({
      name,
      description: description || null,
      addressId: addressId || null,
      capacity: capacity || null,
      amenities: amenities ? JSON.parse(JSON.stringify(amenities)) : null,
      facilities: facilities ? JSON.parse(JSON.stringify(facilities)) : null,
      reservationInfo: reservationInfo || null,
      costPerNight: costPerNight || null,
      baseFee: baseFee || null,
      operatingSeasonStart: operatingSeasonStart || null,
      operatingSeasonEnd: operatingSeasonEnd || null,
      petPolicy,
      reservationRequired: reservationRequired || false,
      siteType,
      firePolicy,
      status: "pending",
      createdBy: user.id,
    })
    .returning();

  // Add to moderation queue
  await addToModerationQueue("camping_site", newCampingSite.id);

  return json(newCampingSite, { status: 201 });
};
