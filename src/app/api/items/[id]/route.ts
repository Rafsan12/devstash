import { auth } from "@/auth";
import { deleteItemById, getItemById, toggleItemPinned } from "@/lib/db/items";
import { NextResponse } from "next/server";

async function getAuthorizedItemId(params: Promise<{ id: string }>) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      error: NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 },
      ),
    };
  }

  const { id } = await params;

  if (!id) {
    return {
      error: NextResponse.json(
        { message: "Item ID is required." },
        { status: 400 },
      ),
    };
  }

  return {
    id,
    userId,
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authorizedItem = await getAuthorizedItemId(params);
    if ("error" in authorizedItem) {
      return authorizedItem.error;
    }

    const item = await getItemById(authorizedItem.userId, authorizedItem.id);

    if (!item) {
      return NextResponse.json(
        { message: "Item not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("[get-item error]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authorizedItem = await getAuthorizedItemId(params);
    if ("error" in authorizedItem) {
      return authorizedItem.error;
    }

    const item = await toggleItemPinned(authorizedItem.userId, authorizedItem.id);

    if (!item) {
      return NextResponse.json(
        { message: "Item not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("[toggle-item-pin error]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authorizedItem = await getAuthorizedItemId(params);
    if ("error" in authorizedItem) {
      return authorizedItem.error;
    }

    const deleted = await deleteItemById(authorizedItem.userId, authorizedItem.id);

    if (!deleted) {
      return NextResponse.json(
        { message: "Item not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[delete-item error]", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
