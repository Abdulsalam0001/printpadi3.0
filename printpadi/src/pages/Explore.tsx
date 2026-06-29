import {
  IonPage,
  IonContent,
  IonSearchbar,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { SearchNormal } from "iconsax-reactjs";

export type TagOption = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
};

const Explore: React.FC = () => {
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState("");
  const [tagOptions, setTagOptions] = useState<TagOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTags = async () => {
      try {
        setLoading(true);
        setError(null);

        const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

        // Fetch tags from API
        const response = await fetch(`${baseUrl}/api/tags`);
        
        if (!response.ok) {
          throw new Error('Failed to load tags');
        }

        const data = await response.json();
        const tags = Array.isArray(data) ? data : data.data?.tags || [];
        setTagOptions(tags);
      } catch (err) {
        console.error('Failed to load categories:', err);
        setError('Failed to load categories');
        // Fallback tags if API fails
        setTagOptions([
          { id: '1', name: 'T-Shirts', slug: 't-shirts' },
          { id: '2', name: 'Mugs', slug: 'mugs' },
          { id: '3', name: 'Hoodies', slug: 'hoodies' },
          { id: '4', name: 'Caps', slug: 'caps' },
          { id: '5', name: 'Bags', slug: 'bags' },
          { id: '6', name: 'Keychains', slug: 'keychains' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadTags();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      history.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleTagClick = (slug: string) => {
    history.push(`/search?tag=${encodeURIComponent(slug)}`);
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div style={{ padding: "16px" }}>
          {/* Search Bar */}
          <div style={{
            display: "flex",
            gap: "8px",
            marginBottom: "20px",
          }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: "20px",
                border: "1px solid #D9D9D9",
                fontSize: "14px",
              }}
            />
            <button
              onClick={handleSearchSubmit}
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: "#000",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <SearchNormal size="18" color="#FFF" variant="Linear" />
            </button>
          </div>

          {/* Categories Header */}
          <h2 style={{
            fontSize: "17px",
            fontWeight: "600",
            marginBottom: "16px",
            marginTop: "20px",
          }}>
            Explore Categories
          </h2>

          {/* Categories Grid */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <p>Loading categories...</p>
            </div>
          ) : error && tagOptions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <p style={{ color: "#999" }}>
                {error}
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "12px",
                paddingBottom: "100px",
              }}
            >
              {tagOptions.map((tag) => (
                <div
                  key={tag.id}
                  onClick={() => handleTagClick(tag.slug)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    cursor: "pointer",
                    padding: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "76px",
                      height: "76px",
                      borderRadius: "50%",
                      backgroundColor: "#f0f0f0",
                      border: "1px solid #e0e0e0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "8px",
                      overflow: "hidden",
                    }}
                  >
                    {tag.imageUrl ? (
                      <img
                        src={tag.imageUrl}
                        alt={tag.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div style={{ fontSize: "10px", color: "#999" }}>
                        {tag.name.substring(0, 1)}
                      </div>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      lineHeight: "1.15",
                      color: "#333",
                      wordWrap: "break-word",
                      maxHeight: "33px",
                      overflow: "hidden",
                    }}
                  >
                    {tag.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Explore;

