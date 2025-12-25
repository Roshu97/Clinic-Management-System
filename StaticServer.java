import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

/**
 * Minimal static file server for local development.
 * Serves files from the current working directory.
 * Maps "/" to "homepage.html".
 */
public class StaticServer {
    private static final Map<String, String> MIME = new HashMap<>();

    static {
        MIME.put("html", "text/html; charset=utf-8");
        MIME.put("css", "text/css; charset=utf-8");
        MIME.put("js", "application/javascript; charset=utf-8");
        MIME.put("svg", "image/svg+xml");
        MIME.put("png", "image/png");
        MIME.put("jpg", "image/jpeg");
        MIME.put("jpeg", "image/jpeg");
        MIME.put("ico", "image/x-icon");
    }

    public static void main(String[] args) throws Exception {
        int port = 9003;
        if (args.length > 0) {
            try { port = Integer.parseInt(args[0]); } catch (NumberFormatException ignored) {}
        }

        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        Path root = Paths.get(".").toAbsolutePath().normalize();
        server.createContext("/", new StaticHandler(root));
        server.setExecutor(null);
        System.out.println("Java HTTP server running at http://localhost:" + port + "/homepage.html");
        server.start();
    }

    static class StaticHandler implements HttpHandler {
        private final Path root;

        StaticHandler(Path root) { this.root = root; }

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String method = exchange.getRequestMethod();
            if (!"GET".equalsIgnoreCase(method)) {
                sendText(exchange, 405, "Method Not Allowed");
                return;
            }

            String rawPath = exchange.getRequestURI().getPath();
            String path = (rawPath == null || "/".equals(rawPath) || "/index.html".equals(rawPath))
                    ? "/index.html" : rawPath;

            Path file = root.resolve(path.substring(1)).normalize();

            // Prevent path traversal
            if (!file.startsWith(root)) {
                sendText(exchange, 403, "Forbidden");
                return;
            }

            // If directory, try to serve its index.html
            if (Files.isDirectory(file)) {
                file = file.resolve("index.html");
            }
            if (!Files.exists(file)) {
                sendText(exchange, 404, "Not Found");
                return;
            }

            String ct = MIME.getOrDefault(getExt(file.getFileName().toString()), "application/octet-stream");
            Headers headers = exchange.getResponseHeaders();
            headers.add("Content-Type", ct);

            byte[] content = Files.readAllBytes(file);
            exchange.sendResponseHeaders(200, content.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(content);
            }
        }

        private static String getExt(String filename) {
            int i = filename.lastIndexOf('.');
            return i == -1 ? "" : filename.substring(i + 1).toLowerCase();
        }

        private static void sendText(HttpExchange exchange, int status, String message) throws IOException {
            byte[] bytes = message.getBytes("UTF-8");
            exchange.getResponseHeaders().add("Content-Type", "text/plain; charset=utf-8");
            exchange.sendResponseHeaders(status, bytes.length);
            try (OutputStream os = exchange.getResponseBody()) { os.write(bytes); }
        }
    }
}