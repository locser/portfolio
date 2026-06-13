import { cn, sanitizeInput } from "./utils";

describe("utils.ts helpers", () => {
  describe("cn", () => {
    it("should merge basic Tailwind classes", () => {
      const result = cn("text-red-500", "bg-blue-500");
      expect(result).toContain("text-red-500");
      expect(result).toContain("bg-blue-500");
    });

    it("should resolve Tailwind class conflicts using twMerge", () => {
      // px-2, py-1 and p-4 conflict; p-4 should override both
      const result = cn("px-2 py-1", "p-4");
      expect(result).toBe("p-4");
    });

    it("should ignore falsy values, null, and undefined", () => {
      const result = cn(
        "class-a",
        false && "class-b",
        null,
        undefined,
        "class-c",
        ""
      );
      expect(result).toBe("class-a class-c");
    });
  });

  describe("sanitizeInput", () => {
    it("should return an empty string for falsy/empty values", () => {
      expect(sanitizeInput("")).toBe("");
      expect(sanitizeInput(null as any)).toBe("");
    });

    it("should escape basic HTML characters (&, <, >, \", ', /) to prevent XSS", () => {
      const input = "<div>& 'hello' / \"world\"</div>";
      const expected = "&lt;div&gt;&amp; &#x27;hello&#x27; &#x2F; &quot;world&quot;&lt;&#x2F;div&gt;";
      expect(sanitizeInput(input)).toBe(expected);
    });

    it("should escape dangerous script tags fully", () => {
      const script = "<script>alert(1)</script>";
      const expected = "&lt;script&gt;alert(1)&lt;&#x2F;script&gt;";
      expect(sanitizeInput(script)).toBe(expected);
    });
  });
});
