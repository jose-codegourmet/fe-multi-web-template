import { prisma } from "@fe-template/db";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@fe-template/ui";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RoleSelect } from "./role-select";

type PageProps = {
  params: Promise<{ id: string }>;
};

async function getUser(id: string) {
  try {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        pets: { orderBy: { createdAt: "desc" } },
        posts: { orderBy: { createdAt: "desc" } },
      },
    });
  } catch {
    return null;
  }
}

export default async function UserDetailPage({ params }: PageProps) {
  const { id } = await params;

  const user = await getUser(id);
  if (!user) notFound();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{user.name ?? user.email}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>{user.role}</Badge>
            <span className="text-muted-foreground">
              Joined {user.createdAt.toLocaleDateString()}
            </span>
          </div>
          {user.bio ? <p className="text-sm">{user.bio}</p> : null}
          <div>
            <p className="mb-2 text-sm font-medium">Change role</p>
            <RoleSelect userId={user.id} role={user.role} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pets ({user.pets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {user.pets.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pets yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Species</TableHead>
                  <TableHead>Breed</TableHead>
                  <TableHead>Age</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.pets.map((pet) => (
                  <TableRow key={pet.id}>
                    <TableCell className="font-medium">{pet.name}</TableCell>
                    <TableCell>{pet.species}</TableCell>
                    <TableCell>{pet.breed ?? "—"}</TableCell>
                    <TableCell>{pet.age ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Posts ({user.posts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {user.posts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No posts yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <Link href={`/posts/${post.id}`} className="font-medium hover:underline">
                        {post.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant={post.published ? "default" : "secondary"}>
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>{post.createdAt.toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
